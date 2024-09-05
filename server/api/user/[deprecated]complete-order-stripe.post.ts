import type { Database } from '../../../types/supabase'
import type { OrderType } from '../../types/complete.order.types'
import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { createStripeCustomer, intentPaymentMethod } from '~/server/utlis/stripe'
import { CompleteOrderValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  const params = await readBody(event)
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient<Database>(event)

  const orderDetails = await CompleteOrderValidation.validateAsync(params)
  if (!orderDetails) {
    throw new CustomError('Invalid input provided', 401)
  }
  else {
    orderDetails.userId = userID
    const { error } = await updateUserAddressDetails(orderDetails)
    if (error)
      throw new CustomError(`Error: ${error.message}`, 400)

    const currentDate = new Date()

    if (orderDetails.planType === 'monthly')
      orderDetails.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())

    else if (orderDetails.planType === 'yearly')
      orderDetails.endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())

    orderDetails.currentDate = currentDate

    // check and create customer on stripe
    const { data: userCheck, error: errorUsercheck, status } = await client.from('user_stripe_details').select('user_id, stripe_user_id').eq('user_id', userID).limit(1).single()

    if (!userCheck) {
      const { customer: stripeCustomer, status, errorMessage } = await createStripeCustomer(orderDetails.email, orderDetails.name)

      if (status === 'Success') {
        const { error: errorInsertStripeUser } = await insertStripeUserDetails(userID, stripeCustomer?.id)
        if (errorInsertStripeUser)
          throw new CustomError(`Error: ${errorInsertStripeUser.message}`, 400)
      }
      else { throw new CustomError(`Error: ${errorMessage}`, 404) }
    }
    if (errorUsercheck)
      throw new CustomError(`Error: ${errorUsercheck.message}`, status)

    const { error: errorUserDetails } = await addUserSubscription(orderDetails)

    if (errorUserDetails)
      return { message: 'Error!', errorUserDetails, status: 400 }

    // Save customer card details on Stripe (FOR Actual Payment Details)*******
    // const [expiryMonth, expiryYear] = orderDetails.expiryDate.split('/')
    // const paymentMethodResponse: any = addPaymentMethod(orderDetails.cardNumber, expiryMonth, expiryYear, orderDetails.securityCode)
    // Need to add main payment logic
    const paymentMethodResponse: any = await intentPaymentMethod(orderDetails.email, orderDetails.amount)

    if (paymentMethodResponse.statusCode === 200) {
      // const { error: errorPaymentMethod } = await updateStripePaymentMethodId(userID, paymentMethodResponse.paymentMethod.id) // for actual payments
      const { error: errorPaymentMethod } = await updateStripePaymentMethodId(userID, paymentMethodResponse.paymentId) // for actual payments
      if (error)
        throw new CustomError(`Error: ${errorPaymentMethod}`, 400)
    }
    else { throw new CustomError(`Error: ${paymentMethodResponse.errorMessage.message}`, paymentMethodResponse.statusCode) }

    return { message: 'Order Complete successfully!', data: orderDetails, status: 200 }
  }

  // Other function to perform logic
  async function updateUserAddressDetails(orderDetails: OrderType): Promise<{ error: any }> {
    return await client.from('user_address_details').update(
      {
        country: orderDetails.country.trim(),
        region: orderDetails.region.trim(),
        city: orderDetails.city.trim(),
        zip_code: orderDetails.zipcode.trim(),
        address: orderDetails.address.trim(),
        phone_number: orderDetails.phoneNumber.trim(),
      },
    ).eq('user_id', userID).select().single()
  }

  async function addUserSubscription(orderDetails: OrderType): Promise<{ error: any }> {
    return await client.from('user_subscriptions').insert(
      {
        user_id: orderDetails.userId,
        sub_type_id: orderDetails.subscriptionTypeId.trim(),
        amount: orderDetails.amount,
        plan_start_date: orderDetails.currentDate,
        plan_end_date: orderDetails.endDate,
        currency: orderDetails.currencyCode,
        plan_type: orderDetails.planType,
      } as never,
    ).single()
  }

  async function updateStripePaymentMethodId(userId: string, paymentMethodId: string): Promise<{ error: any }> {
    return await client.from('user_stripe_details').update(
      {
        stripe_payment_method_id: paymentMethodId.trim(),
        has_payment_method_active: true,
      },
    ).eq('user_id', userId).select().single()
  }

  // insert new user in stripe table
  async function insertStripeUserDetails(userId: string, stripe_user_id: string | undefined): Promise<{ error: any }> {
    return await client.from('user_stripe_details').insert(
      {
        user_id: userId,
        stripe_user_id,
      },
    ).single()
  }
})
