import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { UserAddressValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  const params = await readBody(event)
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  try {
    const chartValidation = await UserAddressValidation.validateAsync(params)
    if (!chartValidation) {
      throw new CustomError('Invalid input provided', 401)
    }
    else {
      const { data, error } = await client.from('user_address_details').update(
        {
          country: chartValidation.country,
          state: chartValidation.state,
          region: chartValidation.region,
          city: chartValidation.city,
          zip_code: chartValidation.zipcode,
          address: chartValidation.address,

        } as never,
      ).eq('user_id', userID).select().single()

      if (error)
        return { message: 'Error!', error, status: 400 }

      return { message: 'Success!', data, status: 200 }
    }
  }
  catch (error: any) {
    return {
      message: error.message,
      status: 501,
    }
  }
})
