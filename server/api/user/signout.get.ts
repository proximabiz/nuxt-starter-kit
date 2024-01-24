import { CustomError } from '../../utlis/custom.error'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { error } = await client.auth.signOut()
  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)
  return 'user logged out!'
})
