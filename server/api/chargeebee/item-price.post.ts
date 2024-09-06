import { ProductItemPriceValidation } from '../../utlis/validations.chargebee'
import { serverSupabaseClient } from '#supabase/server'
import { createItemPrice } from '~/server/utlis/chargebee'
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
  const itemPriceParam = await ProductItemPriceValidation.validateAsync(params)
  if (!itemPriceParam)
    throw new CustomError('Invalid input provided', 401)
  const { data: subTypeData, error: subTypeError, status: subTypeStatus } = await client.from('subscription_type').select(
        `
            chargebee_plan_id
        `,
  ).eq('id', params.subTypeId).limit(1).single()

  if (subTypeError)
    throw new CustomError(`${subTypeError.message}`, subTypeStatus)

  if (subTypeData)
    itemPriceParam.itemId = subTypeData.chargebee_plan_id
    //  if(itemPriceParam.periodUnit == 'month'){
    //     itemPriceParam.price = subTypeData.monthly_price
    //  }
    //  else if(itemPriceParam.periodUnit == 'year'){
    //     itemPriceParam.price = subTypeData.yearly_price
    //  }

  const { statusCode, itemPrice, error: itemPriceError } = await createItemPrice(itemPriceParam)

  if (itemPriceError)
    throw new CustomError(`Item Price${itemPriceError.message}`, statusCode)

  // inserting chargebee plan/item price details
  const { data: chargebeeItemPriceData, error: chargeItemError } = await client.from('chargebee_item_price_details').insert(
    {
      name: itemPrice.name,
      currency_code: itemPrice.currency_code,
      chargebee_item_price_id: itemPrice.id,
      chargebee_plan_id: itemPrice.item_id,
      external_name: itemPrice.external_name,
      is_taxable: itemPrice.is_taxable,
      period_unit: itemPrice.period_unit,
      price: itemPrice.price,
      status: itemPrice.status,
    },
  ).single()

  if (chargeItemError)
    throw new CustomError(`Supabase Error Item Price! ${chargeItemError}`, 401)
  return {
    chargebeeItemPriceData,
    statusCode,
    message: 'Success',
  }
})
