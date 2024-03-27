import type { Database } from '../../../types/supabase'
import { CustomError } from '../../utlis/custom.error'
import { UserSubscriptionValidation } from '../../utlis/validations'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
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
  if (params.amount > 0) {
    if (subData.monthly_price === params.amount) {
      // End date for a month (30 days)
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
      monthDate.setUTCHours(23, 59, 0, 0) // Set time to 24:00:00.000Z
      endDate = monthDate
    }
    else if (subData.yearly_price === params.amount) {
      // End date for a year (365 days)
      const yearDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
      yearDate.setUTCHours(23, 59, 0, 0) // Set time to 24:00:00.000Z
      endDate = yearDate
    }
  }
  else {
    // End date for a week (7 days)
    const weekDate = endDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000))
    weekDate.setUTCHours(23, 59, 0, 0) // Set time to 24:00:00.000Z
    endDate = weekDate
  }
  const { data: userSub, error, status } = await client.from('user_subscriptions').insert([
    {
      user_id: params.userId,
      sub_type_id: params.subscriptionTypeId,
      amount: params.amount,
      plan_start_date: currentDate,
      plan_end_date: endDate,
    },
  ] as never)

  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)
  return { message: 'You have successfully subscribed!', data: { userSub }, status }
})
