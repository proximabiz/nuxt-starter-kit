import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userId = event.context.user.id

  const client = await serverSupabaseClient<Database>(event)

  // Fetch user subscription information
  const { data: subscriptionData, error: subscriptionError, status: subscriptionStatus } = await client
    .from('user_subscriptions')
    .select('plan_start_date, plan_end_date, sub_type_id, plan_type')
    .eq('user_id', userId)
    .eq('is_subscription_active', true)
    .order('id', { ascending: false })
    .single()

  if (subscriptionError)
    throw new CustomError(`Supabase Error: ${subscriptionError.message}`, subscriptionStatus)

  const { plan_start_date, plan_end_date, sub_type_id, plan_type } = subscriptionData

  // Fetch the limit from the subscription_type table using sub_type_id
  const { data: subscriptionTypeData, error: subscriptionTypeError, status: subscriptionTypeStatus } = await client
    .from('subscription_type')
    .select('limit')
    .eq('id', sub_type_id)
    .single()

  if (subscriptionTypeError)
    throw new CustomError(`Supabase Error: ${subscriptionTypeError.message}`, subscriptionTypeStatus)

  const { limit } = subscriptionTypeData

  // Determine the period type and set the start date accordingly
  let periodType: 'monthly' | 'yearly'
  let periodLimit: number | null

  if (plan_type === 'monthly') {
    periodType = 'monthly'
    periodLimit = limit
  }
  else if (plan_type === 'yearly' && limit) {
    periodType = 'yearly'
    periodLimit = limit * 12
  }
  else {
    throw new CustomError('Unknown plan type', 400)
  }

  // Fetch diagrams count based on the period type
  const { count: diagramCount, error: diagramError } = await client
    .from('diagrams')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', new Date(plan_start_date).toISOString())
    .lte('created_at', new Date(plan_end_date).toISOString())
    .neq('title', 'default')

  if (diagramError)
    throw new CustomError(`Supabase Error: ${diagramError.message}`, 500)

  return {
    status: 200,
    message: 'Success',
    currentCount: diagramCount,
    allowedCount: periodLimit,
    planType: periodType,
  }
})
