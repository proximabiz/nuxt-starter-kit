import { CustomError } from '../../utlis/custom.error'
import { UserSubscriptionValidation } from '../../utlis/validations'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)
  const validate = await UserSubscriptionValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)

  const { data: subData, error: subError, status: subStatus } = await client
    .from('subscription_type')
    .select('id, monthly_price, yearly_price')
    .eq('id', params.subscriptionTypeId)
    .single()

  if (subError)
    throw new CustomError(`Supabase Error: ${subError.message}`, subStatus)

  const { data: userSubCheck, error: userSubError, status: userSubStatus } = await client
    .from('user_subscriptions')
    .select('user_id')
    .eq('user_id', params.userId)
    .eq('is_subscription_active', true)

  if (userSubError)
    throw new CustomError(`Supabase Error: ${userSubError.message}`, userSubStatus)
  if (userSubCheck.length > 0)
    throw new CustomError(`User is already there with subscription`, 401)

  const currentDate = new Date()
  let endDate = new Date()
  if (params.ammount > 0) {
    if (subData.monthly_price === params.ammount) {
      // End date for a month (30 days)
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
    }
    else if (subData.yearly_price === params.ammount) {
      // End date for a year (365 days)
      endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
    }
  }
  else {
    // End date for a week (7 days)
    endDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000))
  }
  const { data: userSub, error, status } = await client.from('user_subscriptions').insert([
    {
      user_id: params.userId,
      sub_type_id: params.subscriptionTypeId,
      amount: params.ammount,
      plan_start_date: currentDate,
      plan_end_date: endDate,
    },
  ] as any)

  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)
  return { message: 'Success!', data: { userSub }, status }
})
