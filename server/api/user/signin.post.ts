import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const params = await readBody(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })

  return {
    data,
    error,
  }
})
