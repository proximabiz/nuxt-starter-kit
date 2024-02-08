import { protectRoute } from '../../utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userId = event.context.user._id
  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('diagram_version').select('*').eq('user_id', userId).select()

  return {
    data,
    error,
    status,
  }
})
