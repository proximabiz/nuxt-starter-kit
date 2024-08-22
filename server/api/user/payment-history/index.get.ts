import { serverSupabaseClient } from '#supabase/server'
import { getListOfTransaction } from '~/server/utlis/chargebee'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  await protectRoute(event)

  const userId = event.context.user.id
  if (!userId)
    throw new CustomError('Please provide user-id', 401)
  const client = await serverSupabaseClient<Database>(event)
  const { data: subUser, error: suError, status: suStatus } = await client.from('user_chargebee_details').select('chargebee_user_id').eq('user_id', userId).single()
  if (suError || !subUser)
    throw new CustomError(suError?.message || 'User not found', suStatus || 404)

  const chargebeeUserId = subUser.chargebee_user_id
  if (!chargebeeUserId)
    throw new CustomError('Chargebee user ID not found', 400)
  const { status, data, error } = await getListOfTransaction(chargebeeUserId)
  if (error)
    throw new CustomError(`${error.message}`, status)
console.log(data)
  return {
    status,
    message: 'Success',
    data,
  }
})
