import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id

  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('user_address').select(
    `*`,
  ).eq('user_id', userID)
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no user address found!', 404)

  return {
    data,
    status,
  }
})
