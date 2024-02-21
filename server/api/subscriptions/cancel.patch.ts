import { CustomError } from '../../utlis/custom.error'
import { CancelUserSubscriptionValidation } from '../../utlis/validations'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)
  const validate = await CancelUserSubscriptionValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)

  const { error, status } = await client.from('user_subscriptions').update(
    {
      is_subscription_active: false,
      note: params.note ?? 'Cancel User Subscriptions',
    } as never,
  ).eq('user_id', params.userId).eq('id', params.userSubscriptionId)
  if (error)
    throw new CustomError(`Supabase Error: ${error.message}`, status)

  //* *** */ Cancel user Subscription in stripe
  // const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');
  // const subscription = await stripe.subscriptions.cancel(
  //   'sub_1MlPf9LkdIwHu7ixB6VIYRyX'
  // );
  return { message: 'Your subscriptions is canceled successfully!', status }
})
