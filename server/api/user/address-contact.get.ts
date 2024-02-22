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
  try {
    const { data: userDetails, error: userError, status } = await client
      .from('user_details')
      .select(`*`)
      .eq('user_id', userID)

    if (userError)
      throw new CustomError(`Supabase Error: ${userError.message}`, status)

    const { data: userAddress, error: errorAddress } = await client
      .from('user_address_details')
      .select(`*`)
      .eq('user_id', userID)

    if (errorAddress)
      throw new CustomError(`Supabase Error: ${errorAddress.message}`, status)

    return {
      status,
      userData,
      userDetails,
      userAddress,
    }
  }
  catch (error: any) {
    return {
      message: `Supabase Error: ${error.message}`,
      status: 401,
    }
  }
})
