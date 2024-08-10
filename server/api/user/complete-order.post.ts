import type { Database } from '../../../types/supabase'
import type { OrderType } from '../../types/complete.order.types'
import { serverSupabaseClient } from '#supabase/server'
import { createChargebeeCustomer, createSubscription } from '~/server/utlis/chargebee'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { intentPaymentMethod } from '~/server/utlis/stripe'
import { CompleteOrderValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userId = event.context.user.id
  const params = await readBody(event)
  if (!userId)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient<Database>(event)

  const orderDetails = await CompleteOrderValidation.validateAsync(params)
  if (!orderDetails) {
    throw new CustomError('Invalid input provided', 401)
  }
  else {
    orderDetails.userId = userId
    const subType = await checkSubscriptionType(orderDetails.subscriptionTypeId)
    if (!subType)
      throw new CustomError('Please provide valid subscription type', 401)

    if (orderDetails.gstNumber) {
      const { error: gstError } = await updateUserGst(orderDetails)
      if (gstError)
        throw new CustomError(`Error 1: ${gstError.message}`, 400)
    }
    const { error } = await updateUserAddressDetails(orderDetails)
    if (error)
      throw new CustomError(`Error 2: ${error.message}`, 400)

    const currentDate = new Date()

    if (orderDetails.planType === 'monthly')
      orderDetails.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())

    else if (orderDetails.planType === 'yearly')
      orderDetails.endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())

    orderDetails.currentDate = currentDate

    // check and create customer on chargebee
    const { data: userCheck, error: errorUsercheck, status: subStatus } = await client.from('user_chargebee_details').select('user_id, chargebee_user_id').eq('user_id', userId).limit(1).single()

    if (!userCheck) {
      const { cutomerId, status, error: errorMessage } = await createChargebeeCustomer(orderDetails)
      orderDetails.customerId = cutomerId
      if (status === 'Success') {
        const { error: errorInsertChargebeeUser } = await insertChargebeeUserDetails(userId, cutomerId)
        if (errorInsertChargebeeUser)
          throw new CustomError(`Error 3: ${errorInsertChargebeeUser.message}`, 400)
      }
      else { throw new CustomError(`Error 4: ${errorMessage.message}`, 404) }
    }
    if (errorUsercheck)
      throw new CustomError(`Error: ${errorUsercheck.message}`, subStatus)
    //* **** */ create user subscription in chargebee **** need to uncomment to fix and check subscription part

    const { error: errorMessage } = await createSubscription(orderDetails, orderDetails.customerId)
    if (errorMessage)
      return { message: 'Error! 5', errorMessage, status: 400 }

    const { error: errorUserDetails } = await addUserSubscription(orderDetails)

    if (errorUserDetails)
      return { message: 'Error! 5', errorUserDetails, status: 400 }

    // **Save customer card details on Stripe (FOR Actual Payment Details)*******
    // **const [expiryMonth, expiryYear] = orderDetails.expiryDate.split('/')
    // **const paymentMethodResponse: any = addPaymentMethod(orderDetails.cardNumber, expiryMonth, expiryYear, orderDetails.securityCode)
    // **Need to add main payment logic
    const paymentMethodResponse: any = await intentPaymentMethod(orderDetails.email, orderDetails.amount)

    if (paymentMethodResponse.statusCode === 200) {
      // const { error: errorPaymentMethod } = await updateStripePaymentMethodId(userId, paymentMethodResponse.paymentMethod.id) // for actual payments
      const { error: errorPaymentMethod } = await updateStripePaymentMethodId(userId, paymentMethodResponse.paymentId) // for actual payments
      if (error)
        throw new CustomError(`Error 6: ${errorPaymentMethod}`, 400)
    }
    else { throw new CustomError(`Error: ${paymentMethodResponse.errorMessage.message}`, paymentMethodResponse.statusCode) }
    // *************** need to uncomment to fix and check subscription part

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
    ).eq('user_id', userId).select().single()
  }

  async function updateUserGst(orderDetails: OrderType): Promise<{ error: any }> {
    return await client.from('user_details').update(
      {
        gst_number: orderDetails.gstNumber.trim(),
      },
    ).eq('user_id', userId).select().single()
  }

  async function checkSubscriptionType(subId: string): Promise<{ error: any }> {
    return await client.from('subscription_type').select('name').eq('id', subId)
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

  // insert new user in chargebee table
  async function insertChargebeeUserDetails(userId: string, chargebee_user_id: string | undefined): Promise<{ error: any }> {
    return await client.from('user_chargebee_details').insert(
      {
        user_id: userId,
        chargebee_user_id,
      },
    ).single()
  }
})
