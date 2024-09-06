import type { Database } from '../../../types/supabase'
import { SubscriptionPlanName } from '../../types/enum'
import { CustomError } from '../../utlis/custom.error'
import { CancelUserSubscriptionValidation } from '../../utlis/validations'
import { cancelSubscription } from '~/server/utlis/chargebee'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const params = await readBody(event)
  const validate = await CancelUserSubscriptionValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)
  let statusCheck = false
  let chargebeeStatus = ''
  const { data: subData, error: subError, status: subStatus } = await client
    .from('subscription_type')
    .select('name')
    .eq('id', params.userSubscriptionId)
    .single()
  if (subError)
    throw new CustomError(`Supabase Error: ${subError.message}`, subStatus)

  if (subData?.name !== SubscriptionPlanName.FREE) {
    //* *** */ Cancel user Subscription in Chargebee (using subscription id)
    const { data: chargeUserSub, error: chargeUserError, status: chargeUserStatus } = await client
      .from('user_subscriptions')
      .select('chargeebee_subscription_id')
      .eq('user_id', params.userId)
      .eq('sub_type_id', params.userSubscriptionId)
      .eq('is_subscription_active', true)
      .single()

    if (chargeUserError)
      throw new CustomError(`Supabase Error: ${chargeUserError.message}`, chargeUserStatus)

    if (chargeUserSub?.chargeebee_subscription_id) {
      const { subscripton: subStatus, error: userSubError, statusCode: userSubStatus } = await cancelSubscription(chargeUserSub?.chargeebee_subscription_id)
      if (userSubError)
        throw new CustomError(`Error: ${userSubError.message}`, userSubStatus)
      chargebeeStatus = subStatus.status ? `ChargeBee Status: ${subStatus.status}` : ''
      if (subStatus && subStatus.status !== 'active')
        statusCheck = true
      else
        statusCheck = false
    }
  }
  else {
    statusCheck = true
  }
  if (statusCheck) {
    const { error, status } = await client.from('user_subscriptions').update(
      {
        is_subscription_active: false,
        note: params.note + chargebeeStatus ?? `Cancel User Subscriptions. ${chargebeeStatus}`,
      },
    ).eq('user_id', params.userId).eq('sub_type_id', params.userSubscriptionId).eq('is_subscription_active', true)
    if (error)
      throw new CustomError(`Supabase Error: ${error.message}`, status)
    return { message: 'Your subscriptions is canceled successfully!', status }
  }
  else {
    throw new CustomError(`Error: unable to cancel subscriptions`, 500)
  }
})
