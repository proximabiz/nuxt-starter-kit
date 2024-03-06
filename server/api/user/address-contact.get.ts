import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)

  const userData = event.context.user
  const userID = event.context.user.id
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)

  const { data: userDetails, error: userError, status } = await client
    .from('user_details')
    .select('id, user_id, name, organisation_name, gst_number, is_active')
    .eq('user_id', userID)

  if (userError)
    throw new CustomError(`Supabase Error: ${userError.message}`, status)

  const { data: userAddress, error: errorAddress } = await client
    .from('user_address_details')
    .select('id, country, zip_code, city, region, address, is_active, user_id, phone_number')
    .eq('user_id', userID)

  if (errorAddress)
    throw new CustomError(`Supabase Error: ${errorAddress.message}`, status)

  return {
    status,
    message: 'Success',
    data: {
      userData,
      userDetails,
      userAddress,
    },
  }
})
