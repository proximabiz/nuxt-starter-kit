import { CustomError } from '../../utlis/custom.error'
import { serverSupabaseClient } from '#supabase/server'
import { protectRoute } from '~/server/utlis/route.protector'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const diagramId = getRouterParam(event, 'id')!
  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('diagrams').select(
    `
    id,
    created_at,
    diagram_type_id(name,id),
    user_id,
    title,
    keywords,
    details,
    response
    `,
  ).eq('id', diagramId)
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram found!', 404)

  return {
    data,
    status,
  }
})
