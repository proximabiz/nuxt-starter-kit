import { serverSupabaseClient } from '#supabase/server'
import { CustomError } from '~/server/utlis/custom.error'
import { protectRoute } from '~/server/utlis/route.protector'
import { CompleteOrderValidation } from '~/server/utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const userID = event.context.user.id
  const params = await readBody(event)
  if (!userID)
    throw new CustomError('Error: no user found!', 404)

  const client = await serverSupabaseClient(event)
  try {
    const orderValidation = await CompleteOrderValidation.validateAsync(params)
    if (!orderValidation) {
      throw new CustomError('Invalid input provided', 401)
    }
    else {
      const { error } = await addUserDetails(orderValidation)
      if (error)
        return { message: 'Error!', error, status: 400 }

      if (orderValidation.subscriptionTypeId) {
        const { data: subData, error: subError, status: subStatus } = await client
          .from('subscription_type')
          .select('monthly_price')
          .eq('id', orderValidation.subscriptionTypeId)
          .single()

        if (subError)
          throw new CustomError(`Supabase Error: ${subError.message}`, subStatus)

        let amount = 0
        const currentDate = new Date()
        let endDate = new Date()
        if (orderValidation.ammount > 0) {
          if (orderValidation.planType.toLowerCase().trim() === 'monthly') {
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
            amount = calculatePlanAmount(orderValidation.currencyCode, subData.monthly_price, 1)
          }
          else if (orderValidation.planType.toLowerCase().trim() === 'yearly') {
            endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
            amount = calculatePlanAmount(orderValidation.currencyCode, subData.monthly_price, 11)
          }
        }
        else {
          endDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000))
        }

        const { error: errorUserDetails } = await addUserSubscription(orderValidation, amount, currentDate, endDate)
        if (errorUserDetails)
          return { message: 'Error!', errorUserDetails, status: 400 }
      }


      // cardHolderName
      // cardNumber
      // expiryDate
      // securityCode

      //Save customer card details on Stripe
      const


      return { message: 'Order Complete successfully!', data: orderValidation, status: 200 }
    }
  }
  catch (error: any) {
    return {
      message: error.message,
      status: 501,
    }
  }

  async function addUserDetails(orderValidation: any): Promise<{ error: any }> {
    return await client.from('user_address_details').insert(
      {
        country: orderValidation.country.trim(),
        region: orderValidation.region.trim(),
        city: orderValidation.city.trim(),
        zip_code: orderValidation.zipcode.trim(),
        address: orderValidation.address.trim(),
        phone_number: orderValidation.phoneNumber.trim(),
        user_id: userID,
      } as never
    ).single()
  }

  async function addUserSubscription(orderValidation: any, amount: number, currentDate: Date, endDate: Date): Promise<{ error: any }> {
    return await client.from('user_subscriptions').insert(
      {
        user_id: userID,
        sub_type_id: orderValidation.subscriptionTypeId.trim(),
        amount,
        plan_start_date: currentDate,
        plan_end_date: endDate,
        currency: orderValidation.currencyCode,
        plan_type: orderValidation.planType,
      } as never
    ).single()
  }
})

function calculatePlanAmount(currencyCode: string, monthlyPriceInUSD: number, months: number) {
  let amount = 0
  switch (currencyCode) {
    case 'USD': // United States
      amount = monthlyPriceInUSD * months
      break
    case 'CAD': // Canada
      amount = (monthlyPriceInUSD * 1.35) * months
      break
    case 'IND': // India
      amount = (monthlyPriceInUSD * 83.02) * months
      break
    default:
      amount = monthlyPriceInUSD * months
      break
  }
  return amount
}

// function calculateEndDate(planType: string) {

//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1;
//   const currentYear = currentDate.getFullYear();

//   // Get the number of days in the current month
//   this.daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
// }


function stripeActivities() {

  // Create User on Stripe Platform
  
  
  // Create Payment Method on Stripe Platform


  // Attach Payment Method to customer on Stripe Platform



}
