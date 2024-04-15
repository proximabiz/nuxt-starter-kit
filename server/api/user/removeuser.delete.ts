import { createClient } from '@supabase/supabase-js'
import { CustomError } from '../../utlis/custom.error'

const url: string = process.env.SUPABASE_URL ?? ''
const key: string = process.env.SUPABASE_SERVICE_KEY ?? ''
const supabase = createClient(url, key)

export default defineEventHandler(async () => {
  const { error } = await supabase.auth.admin.deleteUser(
    'e0cedf7f-7e7e-49ce-a86b-fecd0c5cce3f',
  )
  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)
  return 'User Deleted Successfully!'
})
