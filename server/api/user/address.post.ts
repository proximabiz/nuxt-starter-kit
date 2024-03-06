import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { UserAddressValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const params = await readBody(event)
  const client = await serverSupabaseClient(event)

  const addressValidation = await UserAddressValidation.validateAsync(params)
  if (!addressValidation) {
    throw new CustomError('Invalid input provided', 401)
  }
  else {
    const { data: address, error, status } = await client.from('user_address_details').insert([
      {
        country: addressValidation.country,
        state: addressValidation.state,
        region: addressValidation.region,
        city: addressValidation.city,
        zip_code: addressValidation.zipcode,
        address: addressValidation.address,
      },
    ] as any).select()
    if (error)
      throw new CustomError(`Supabase Error: ${error.message}`, status)

    return { message: 'Success!', data: { address }, status }
  }
})
