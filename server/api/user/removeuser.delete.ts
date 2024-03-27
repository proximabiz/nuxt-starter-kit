import { createClient } from '@supabase/supabase-js'
import { CustomError } from '../../utlis/custom.error'

const supabase = createClient('https://oaemobmedmjoqcbcoxoe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZW1vYm1lZG1qb3FjYmNveG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTk5MTg2OSwiZXhwIjoyMDIxNTY3ODY5fQ.qNvsjb8JKoqY6HHjd2qJlyP1zXHlvEu38RTAv-NfOKM')

export default defineEventHandler(async () => {
  const { error } = await supabase.auth.admin.deleteUser(
    '6a8fda3f-c87c-4cce-8781-2d8619fc13bd',
  )
  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)
  return 'User Deleted Successfully!'
})
