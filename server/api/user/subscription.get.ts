import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)

  const userID = event.context.user.id
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  try {
    const { data, error, status } = await client
      .from('user_subscriptions')
      .select(`
      *,
      subscription_type ( * )
    `).eq('user_id', userID)

    if (error)
      throw new CustomError(`Supabase Error: ${error.message}`, status)

    return {
      status,
      data,
    }
  }
  catch (error: any) {
    return {
      message: `Supabase Error: ${error.message}`,
      status: 401,
    }
  }
})
