import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '../../utlis/custom.error'
import { SignupValidation } from '../../utlis/validations'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)
  const validate = await SignupValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)
  const { error } = await client.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        name: params.name,
      },
      emailRedirectTo: 'http://localhost:3000/auth?action=signin',
    },
  })

  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)
  return { message: 'An verification link has been sent to your email, please follow the same for completing your signUp process', status: 200 }
})
