import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('diagram_type').select('id, name, description, icon, status')
  if (error)
    throw new CustomError(`Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram-type found!', 404)

  return {
    data,
    status,
  }
})
