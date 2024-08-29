import { getItemDetails, getItemDetailsById } from '~/server/utlis/chargebee'

export default defineEventHandler(async () => {
  try {
    const { status, statusCode, plans, error } = await getItemDetails()

    if (status === 'Error') {
      console.error('Error retrieving item details:', error)
      return {
        statusCode: statusCode || 500,
        body: { message: 'Error retrieving item details', error },
      }
    }

    const { plan } = await getItemDetailsById('Premium-Plan-fcb9588a-38bc-451d-b227-8ddbb2fbcca3')

    // console.log('Customer card: ', plans);
    return {
      statusCode: 200,
      body: plans,
      res: plan,
    }
  }
  catch (err: any) {
    console.error('Unexpected error:', err)
    return {
      statusCode: 500,
      body: { message: 'Unexpected error occurred', error: err.message },
    }
  }
})
