import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { UserAddressContactValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  const params = await readBody(event)
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  try {
    const chartValidation = await UserAddressContactValidation.validateAsync(params)
    if (!chartValidation) {
      throw new CustomError('Invalid input provided', 401)
    }
    else {
      const { error } = await client.from('user_address_details').insert(
        {
          country: chartValidation.country.trim(),
          region: chartValidation.region.trim(),
          city: chartValidation.city.trim(),
          zip_code: chartValidation.zipcode.trim(),
          address: chartValidation.address.trim(),
          phone_number: chartValidation.phoneNumber.trim(),
          user_id: userID,
        } as never,
      ).single()

      if (error)
        return { message: 'Error!', error, status: 400 }

      const { error: errorUserDetails } = await client.from('user_details').insert(
        {
          name: chartValidation.name.trim(),
          organisation_name: chartValidation.organisationName.trim(),
          user_id: userID,
        } as never,
      ).single()
      if (errorUserDetails)
        return { message: 'Error!', errorUserDetails, status: 400 }

      return { message: 'User address added successfully!', data: chartValidation, status: 200 }
    }
  }
  catch (error: any) {
    return {
      message: error.message,
      status: 501,
    }
  }
})
