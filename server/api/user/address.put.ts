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

  const chartValidation = await UserAddressValidation.validateAsync(params)
  if (!chartValidation) {
    throw new CustomError('Invalid input provided', 401)
  }
  else {
    const { data, error } = await client.from('user_address_details').update(
      {
        country: chartValidation.country.trim(),
        region: chartValidation.region.trim(),
        city: chartValidation.city.trim(),
        zip_code: chartValidation.zipcode.trim(),
        address: chartValidation.address.trim(),
        phone_number: chartValidation.phoneNumber.trim(),

      } as never,
    ).eq('user_id', userID).select().single()

    if (error) {
      throw new CustomError('Error!', 400)
    }
    else {
      await client.auth.updateUser({
        phone: chartValidation.phoneNumber,
      })
    }
    return { message: 'Success!', data, status: 200 }
  }
})
