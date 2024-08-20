import type { Database } from '../../../types/supabase'
import { CustomError } from '../../utlis/custom.error'
import { UserSubscriptionValidation } from '../../utlis/validations'
import { serverSupabaseClient } from '#supabase/server'

interface SubscriptionParams {
  userId: string
  subscriptionTypeId: string
  amount: number
  email: string
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const params: SubscriptionParams = await readBody(event)

  const validate = await UserSubscriptionValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)

  // Fetch subscription type data
  const { data: subData, error: subError, status: subStatus } = await client
    .from('subscription_type')
    .select('id, monthly_price, yearly_price')
    .eq('id', params.subscriptionTypeId)
    .single()

  if (subError)
    throw new CustomError(`Supabase Error: ${subError.message}`, subStatus)

  // Check if user already has an active subscription
  const { data: userSubCheck, error: userSubError, status: userSubStatus } = await client
    .from('user_subscriptions')
    .select('user_id, sub_type_id')
    .eq('user_id', params.userId)
    .eq('is_subscription_active', true)

  if (userSubError)
    throw new CustomError(`Supabase Error: ${userSubError.message}`, userSubStatus)

  // Restrict creation of specific sub_type_id if user has canceled this subscription before
  const restrictedSubTypeId = '10dbc647-04ea-4588-b6c8-7c535049f18c'
  if (userSubCheck.some(sub => sub.sub_type_id === restrictedSubTypeId))
    throw new CustomError(`You cannot create a subscription with this type again after cancellation.`, 401)

  if (userSubCheck.length > 0)
    throw new CustomError(`User already has an active subscription`, 401)

  const currentDate = new Date()
  let endDate = new Date()

  if (params.amount > 0) {
    if (subData?.monthly_price === params.amount) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
      monthDate.setUTCHours(23, 59, 0, 0)
      endDate = monthDate
    }
    else if (subData?.yearly_price === params.amount) {
      const yearDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
      yearDate.setUTCHours(23, 59, 0, 0)
      endDate = yearDate
    }
  }
  else {
    const checkUser = checkEmailDomain(params.email, 'proximabiz.com')
    if (checkUser) {
      const yearDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
      yearDate.setUTCHours(23, 59, 0, 0)
      endDate = yearDate
    }
    else {
      const weekDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      weekDate.setUTCHours(23, 59, 0, 0)
      endDate = weekDate
    }
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

function checkEmailDomain(email: string, domain: string): boolean {
  const emailParts = email.split('@')
  const emailDomain = emailParts[1]
  return emailDomain === domain
}
