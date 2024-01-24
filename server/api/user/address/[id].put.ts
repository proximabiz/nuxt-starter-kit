import { CustomError } from '../../../utlis/custom.error'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const params = await readBody(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })

  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no user found!', 404)

  return {
    data,
  }
})
