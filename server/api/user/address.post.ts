import { serverSupabaseClient } from '#supabase/server'
import { protectRoute } from '~/server/utlis/route.protector'
import { UserAddressValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const params = await readBody(event)
  const client = await serverSupabaseClient(event)

  const addressValidation = await UserAddressValidation.validateAsync(params)
  if (!addressValidation) {
    return createError({
      statusCode: 400,
      message: 'Invalid input provided',
      data: null,
    })
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
    if (error) {
      return createError({
        statusCode: 400,
        message: error.message,
        data: null,
      })
    }

    return { message: 'Success!', data: { address }, status }
  }
})
