import { getIProductFamilyDetails, getProductFamilyDetailsById } from '~/server/utlis/chargebee'

export default defineEventHandler(async () => {
  try {
    const { status, statusCode, productFamily, error } = await getIProductFamilyDetails()

    if (status === 'Error') {
      console.error('Error retrieving product family details:', error)
      return {
        statusCode: statusCode || 500,
        body: { message: 'Error retrieving product family details', error },
      }
    }

    const { family } = await getProductFamilyDetailsById('AFM-Test-01919C55-8D48-1308-1F26-CCCAB233416D')

    // console.log('Customer card: ', plans);
    return {
      statusCode: 200,
      body: productFamily,
      res: family,
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
