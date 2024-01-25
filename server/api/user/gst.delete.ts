import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { UserGSTValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id

  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  try {
    const { error } = await client.from('user_details').update({
      gst_number: '',
    } as never).eq('user_id', userID)

    if (error)
      return { message: 'Error!', error, status: 400 }

    return { message: 'Success - GST Number deleted successfully', status: 200 }
  }
  catch (error: any) {
    return {
      message: error.message,
      status: 501,
    }
  }
})
