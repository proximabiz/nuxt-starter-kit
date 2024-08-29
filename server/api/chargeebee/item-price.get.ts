import { getItemPriceDetails, getItemPriceDetailsById } from '~/server/utlis/chargebee'

export default defineEventHandler(async () => {
  try {
    const { status, statusCode, itemPrice, error } = await getItemPriceDetails()

    if (status === 'Error') {
      console.error('Error retrieving item price details:', error)
      return {
        statusCode: statusCode || 500,
        body: { message: 'Error retrieving item price details', error },
      }
    }

    const { plans } = await getItemPriceDetailsById('Premium-Plan-fcb9588a-38bc-451d-b227-8ddbb2fbcca3-INR-Monthly')

    // console.log('Customer card: ', plans);
    return {
      statusCode: 200,
      body: itemPrice,
      res: plans,
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
