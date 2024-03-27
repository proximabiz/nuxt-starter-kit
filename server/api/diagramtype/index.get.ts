import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient<Database>(event)
  const { data, error, status } = await client.from('diagram_type').select('id, name, description, icon, status')
  if (error)
    throw new CustomError(`Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram-type found!', 404)

  return {
    data,
    status,
    message: 'Success',
  }
})
