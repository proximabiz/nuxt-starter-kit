import type { Database } from '../../../types/supabase'
import type { OrderType, SubscriptionDetails, TransactionDetails } from '../../types/complete.order.types'
import { SubscriptionPlanName } from '../../types/enum'
import { serverSupabaseClient } from '#supabase/server'
import { cancelSubscription, createChargebeeCustomer, createSubscription, getCustomerSubscription, getCustomerTransactionDetails } from '~/server/utlis/chargebee'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
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
    const { data: subData, error: subError, status: subTypeStatus } = await client.from('subscription_type').select('name, chargebee_plan_id').eq('id', orderDetails.subscriptionTypeId).limit(1).single()
    if (!subData)
      throw new CustomError('Please provide valid subscription type', subTypeStatus)

    if (subError)
      throw new CustomError(`Error to get subscription details: ${subError}`, subTypeStatus)
    // Checking user should not be able to pass free plan
    if (subData && subData.name === SubscriptionPlanName.FREE)
      throw new CustomError(`Please choose correct plan type`, subTypeStatus)
    const chargebeePlanId = subData ? subData.chargebee_plan_id : 'test'
    if (orderDetails.gstNumber) {
      const { error: gstError } = await updateUserGst(orderDetails)
      if (gstError)
        throw new CustomError(`Error in updating gst details:  ${gstError.message}`, 400)
    }
    const { error } = await updateUserAddressDetails(orderDetails)
    if (error)
      throw new CustomError(`Error while trying to update user deatils: ${error.message}`, 400)

    // check and create customer on chargebee
    const { data: userCheck } = await client.from('user_chargebee_details').select('user_id, chargebee_user_id').eq('user_id', userId).limit(1).single()
    if (!userCheck) {
      const { cutomerId, status, error: errorMessage } = await createChargebeeCustomer(orderDetails)
      orderDetails.customerId = cutomerId
      if (status === 'Success') {
        const { error: errorInsertChargebeeUser } = await insertChargebeeUserDetails(userId, cutomerId)
        if (errorInsertChargebeeUser)
          throw new CustomError(`Error while trying to update customer deatils: ${errorInsertChargebeeUser.message}`, 400)
      }
      else { throw new CustomError(`Error while trying to create customer on chargbee: ${errorMessage.message}`, 404) }
    }
    else {
      orderDetails.customerId = userCheck?.chargebee_user_id
    }
    // if (errorUsercheck)
    //   throw new CustomError(`Error while trying to get user details: ${errorUsercheck.message}`, subStatus)

    //* **** */ create user subscription in chargebee
    //  ***** getting Plan/Item details with price
    if (chargebeePlanId) {
      const periodTime = orderDetails.planType.split('ly')
      const { data: itemData, error: itemError, status: itemStatus } = await client
        .from('chargebee_item_price_details')
        .select('chargebee_item_price_id, price, currency_code, name')
        .eq('chargebee_plan_id', chargebeePlanId)
        .eq('period_unit', periodTime[0])
        .eq('currency_code', orderDetails.currencyCode)
        .limit(1)
        .single()
      if (itemError)
        throw new CustomError(`Error while trying to get item and price details: ${itemError.message}`, itemStatus)

      if (itemData) {
        const subscription: SubscriptionDetails = {
          subscriptionTypeId: chargebeePlanId,
          itemPriceId: itemData.chargebee_item_price_id ? itemData.chargebee_item_price_id : 'test',
          amount: itemData.price ? itemData.price : 0,
        }

        // check subscription check on chargebee side
        const { data: chargebeeSubId, error: checkSubError, status: checkSubTypeStatus } = await client.from('user_subscriptions').select('chargeebee_subscription_id').eq('user_id', userId).eq('is_subscription_active', true).order('created_at', { ascending: false }).limit(1).single()

        if (chargebeeSubId && chargebeeSubId.chargeebee_subscription_id) {
          const { subcriptionDetails: checkChargebeeSubscription, error: chargebeeErrorMessage } = await getCustomerSubscription(chargebeeSubId.chargeebee_subscription_id)

          if (chargebeeErrorMessage)
            return { message: 'Error while trying to get subscription details from chargebee: ', chargebeeErrorMessage, status: 403 }
          if (checkSubError)
            return { message: 'Error while trying to fetch user subsciption: ', checkSubError, status: checkSubTypeStatus }

          if (checkChargebeeSubscription && checkChargebeeSubscription.status === 'active') {
            // need to check for previous subscription and put them cancel on both our and chargebee side
            const { subscripton: chargebeeSubStatus, error: userChargebeeSubError, statusCode: userChargebeeSubStatus } = await cancelSubscription(chargebeeSubId.chargeebee_subscription_id)
            if (userChargebeeSubError)
              throw new CustomError(`Error: ${userChargebeeSubError.message}`, userChargebeeSubStatus)
            if (chargebeeSubStatus) {
              const { error, status } = await client.from('user_subscriptions').update(
                {
                  is_subscription_active: false,
                  note: params.note + chargebeeSubStatus.status ? params.note + chargebeeSubStatus.status : `Cancel User Subscriptions. ${chargebeeSubStatus.status}`,
                },
              ).eq('user_id', userId).eq('is_subscription_active', true).eq('chargeebee_subscription_id', chargebeeSubId.chargeebee_subscription_id)
              if (error)
                throw new CustomError(`Error while changing status of previous subscription: ${error.message}`, status)
            }
          }
        }

        const { subscripton: chargebeeSubscription, error: errorMessage } = await createSubscription(subscription, orderDetails.customerId)

        if (errorMessage)
          return { message: 'Error while trying to create subscription: ', errorMessage, status: 400 }
        if (chargebeeSubscription && chargebeeSubscription.subscription) {
          orderDetails.currentDate = new Date(chargebeeSubscription.subscription.current_term_start * 1000).toISOString()
          orderDetails.endDate = new Date(chargebeeSubscription.subscription.current_term_end * 1000).toISOString()
          orderDetails.currencyCode = chargebeeSubscription.subscription.currency_code
          orderDetails.chargebeeSubId = chargebeeSubscription.subscription.id
          orderDetails.amount = chargebeeSubscription.subscription.subscription_items[0].amount
          orderDetails.object = chargebeeSubscription.subscription.object

          const { transactionDetails: chargebeeTransaction, error: errorTransactionMessage } = await getCustomerTransactionDetails(orderDetails.customerId, chargebeeSubscription.subscription.id)

          const transactionDetails = {
            transactionId: chargebeeTransaction.transaction.id,
            paymentSourceId: chargebeeTransaction.transaction.payment_source_id,
            gateway: chargebeeTransaction.transaction.gateway,
            paymentMethod: chargebeeTransaction.transaction.payment_method,
            transactionStatus: chargebeeTransaction.transaction.status,
          }

          if (errorTransactionMessage)
            return { message: 'Error while trying to get user transaction details: ', errorTransactionMessage, status: 400 }

          const { error: errorUserDetails } = await addUserSubscription(orderDetails, transactionDetails)

          if (errorUserDetails)
            return { message: 'Error while trying to insert subscription details: ', errorUserDetails, status: 400 }

          // insert payment details in our db

          const { error: errorTransaction } = await addUserTransaction(transactionDetails, orderDetails.customerId)
          if (errorTransaction)
            return { message: 'Error while trying to update transaction details: ', errorUserDetails, status: 400 }
        }
      }
      // **Need to add main payment logic once go to live and check flow

      return { message: 'Order Complete successfully!', status: 200 }
    }
    else {
      throw new CustomError(`Error while trying to get item/plan and price details: `, 404)
    }
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

  async function addUserSubscription(subscription: SubscriptionDetails, transaction: TransactionDetails): Promise<{ error: any }> {
    return await client.from('user_subscriptions').insert(
      {
        user_id: subscription.userId,
        sub_type_id: subscription.subscriptionTypeId.trim(),
        amount: subscription.amount,
        plan_start_date: subscription.currentDate,
        plan_end_date: subscription.endDate,
        currency: subscription.currencyCode,
        plan_type: subscription.planType,
        chargeebee_subscription_id: subscription.chargebeeSubId,
        object: subscription.object,
        chargebee_payment_method_id: transaction.transactionId,
        payment_method_type: transaction.paymentMethod,
        chargebee_payment_status: transaction.transactionStatus,
        gateway: transaction.gateway,
        payment_source_id: transaction.paymentSourceId,
      } as never,
    ).single()
  }

  async function addUserTransaction(transection: TransactionDetails, chargebeeUserId: string): Promise<{ error: any }> {
    return await client.from('user_chargebee_details').update(
      {
        chargebee_payment_method_id: transection.transactionId,
        gateway: transection.gateway,
        payment_source_id: transection.paymentSourceId,
        chargebee_status: transection.transactionStatus,
      },
    ).eq('chargebee_user_id', chargebeeUserId).select().single()
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
