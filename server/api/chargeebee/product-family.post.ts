import { ProductFamilyValidation } from '../../utlis/validations.chargebee'
import { serverSupabaseClient } from '#supabase/server'
import { createProductFamily } from '~/server/utlis/chargebee'
import { CustomError } from '~/server/utlis/custom.error'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  // await protectRoute(event)
  const params = await readBody(event)
  // const userId: string = getRouterParam(event, 'id')!
  // if (!userId)
  //     throw new CustomError('Please provide user-id', 401)
  const productFam = await ProductFamilyValidation.validateAsync(params)
  if (!productFam)
    throw new CustomError('Invalid input provided', 401)

  const client = await serverSupabaseClient<Database>(event)

  const { statusCode, family, error } = await createProductFamily(productFam)

  if (error)
    throw new CustomError(`${error.message}`, statusCode)

  // issue with subcription update
  const { error: subError } = await client.from('subscription_type')
    .update({
      chargeebee_product_family_id: 'AFM-Test-01919C55-8D48-1308-1F26-CCCAB233416D',
    })
    .not('id', 'is', null)
    .select()

  if (subError)
    throw new CustomError(`Supabase Error! ${subError}`, 401)
  return {
    family,
    statusCode,
    message: 'Success',
  }
})
