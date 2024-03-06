import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  // const addressId: string = getRouterParam(event, 'id')!
  const client = await serverSupabaseClient(event)
  // const { data, error, status } = await client.from('user_address_details').select(
  //   `*`,
  // ).eq('id', addressId).eq('user_id', userID)

  const { data, error, status } = await client.from('user_address_details').select(
    'id, country, zip_code, city, region, address, is_active, user_id, phone_number',
  ).eq('user_id', userID)
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no user address found!', 404)

  return {
    data,
    status,
    message: 'Success',
  }
})
