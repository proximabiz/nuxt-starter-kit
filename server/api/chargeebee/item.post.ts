import { ProductItemValidation } from '../../utlis/validations.chargebee'
import { serverSupabaseClient } from '#supabase/server'
import { createItem } from '~/server/utlis/chargebee'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const params = await readBody(event)
  const client = await serverSupabaseClient<Database>(event)

  const userId = event.context.user.id
  if (!userId)
    throw new CustomError('Please provide user-id', 401)
  const itemParam = await ProductItemValidation.validateAsync(params)
  if (!itemParam)
    throw new CustomError('Invalid input provided', 401)
  const { data: subTypeData, error: subTypeError, status: subTypeStatus } = await client.from('subscription_type').select(
        `
            chargeebee_product_family_id
        `,
  ).eq('id', params.subTypeId).limit(1).single()

  if (subTypeError)
    throw new CustomError(`${subTypeError.message}`, subTypeStatus)

  if (subTypeData)
    itemParam.productFamily = subTypeData.chargeebee_product_family_id

  const { statusCode, item, error } = await createItem(itemParam)

  if (error)
    throw new CustomError(`Item: ${error.message}`, statusCode)

  // updating chargebee plan/item id's
  const { data, error: subError } = await client.from('subscription_type')
    .update({
      chargebee_plan_id: item.id,
    })
    .eq('id', itemParam.subTypeId)
    .select()
  if (subError)
    throw new CustomError(`Supabase Error Plan! ${subError}`, 401)

  return {
    data,
    statusCode,
    message: 'Success',
  }
})
