import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('user_details').select(
    'id, user_id, name, organisation_name, gst_number, is_active',
  ).eq('user_id', userID).select('gst_number').single()
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no user gst number found!', 404)

  return {
    data,
    status,
  }
})
