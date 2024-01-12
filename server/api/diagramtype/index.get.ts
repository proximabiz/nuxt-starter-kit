import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.from('diagram_type').select('*')

  return {
    data,
    error,
  }
})
