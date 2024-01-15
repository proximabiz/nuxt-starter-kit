import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const params = await readBody(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return {
    data,
    error,
  }
})
