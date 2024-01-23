import { createClient } from '@supabase/supabase-js'
import { CustomError } from '../../utlis/custom.error'

const supabase = createClient('https://xfajccbyotmquasezjti.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYWpjY2J5b3RtcXVhc2V6anRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjYxNTU1MSwiZXhwIjoyMDE4MTkxNTUxfQ.KdqROCab1UsLmyZ8EetWlytJ0TepRWTuR8sv54QsH1w')

export default defineEventHandler(async () => {
  const { error } = await supabase.auth.admin.deleteUser(
    'd58a71d6-f3a2-4794-b756-608e4f0caa43',
  )
  if (error)
    throw new CustomError(`Error: ${error.message}`, 400)
  return 'User Deleted Successfully!'
})
