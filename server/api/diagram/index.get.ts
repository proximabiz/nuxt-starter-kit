import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
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
    access,
    diagram_identifier,
    response
    `,
  ).eq('user_id', userID)
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram found!', 404)

  return {
    data,
    status,
    message: 'Success',
  }
})
