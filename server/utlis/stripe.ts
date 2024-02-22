import { Stripe } from 'stripe'

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
const stripeInstance = new Stripe('sk_test_51OdqycSA9XKEVEBUvVl6KDV9nW5sNr3bHjRh9htCioXMC9YkQzP6o9xN9OPTVfkqhzhdNE6AQqrF9c0I1OCZcxzY0011diWopS')

// Add create customer to the stripe platform
async function createStripeCustomer(email: string, name: string) {
  try {
    const customer = await stripeInstance.customers.create({
      email,
      name,
    })
    return { status: 'Success', statusCode: 200, customer }
  }
  catch (error: any) {
    console.error('Error creating customer:', error.message)
    let errorMessage = handleStripeErrors(error)
    if (!errorMessage)
      errorMessage = `Could not create customer : ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

// Add payment method to the customers
async function addPaymentMethod(cardNumber: string, expMonth: number, expYear: number, cvc: string) {
  try {
    const paymentMethod = await stripeInstance.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    })
    return { status: 'Success', statusCode: 200, paymentMethod }
  }
  catch (error: any) {
    let errorMessage = handleStripeErrors(error)
    if (!errorMessage)
      errorMessage = `Could not add payment method : ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

// Attach payment method to the customers
async function attachPaymentMethodToUser(stripeCustomerId: string, stripePaymentMethodId: string) {
  try {
    const attachedPaymentMethod = await stripeInstance.paymentMethods.attach(
      stripePaymentMethodId,
      { customer: stripeCustomerId },
    )
    return { status: 'Success', statusCode: 200, attachedPaymentMethod }
  }
  catch (error: any) {
    let errorMessage = handleStripeErrors(error)
    if (!errorMessage)
      errorMessage = `Could not attach payment method to customer : ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

// Payment Intent - we are using this instead of Payment Charge.
async function createPaymentIntent(amount: number, currency: string, paymentMethodId: string, userEmail: string) {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: true,
      payment_method: paymentMethodId,
      receipt_email: userEmail,
    })
    return { status: 'Success', statusCode: 200, paymentIntent }
  }
  catch (error: any) {
    console.error('Error creating payment intet:', error)
    let errorMessage = handleStripeErrors(error)
    if (!errorMessage)
      errorMessage = `Could not create payment intent : ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

// Cancel subscription - here subscriptionId is the id associate with subscription in stripe platfrom.
async function cancelSubscription(subscriptionId: string) {
  try {
    // Retrieve the subscription
    const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId)
    // Cancel the subscription
    await stripeInstance.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
    return { status: 'Success', statusCode: 200, subscription }
  }
  catch (error: any) {
    console.error('Error canceling subscription:', error)
    let errorMessage = handleStripeErrors(error)
    if (!errorMessage)
      errorMessage = `Could not cancel subscription : ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

function handleStripeErrors(error: any) {
  let errorMessage = ''
  switch (error.type) {
    case 'StripeCardError':
      errorMessage = `Card declined: ${error.message}`
      break
    case 'StripeInvalidRequestError':
      errorMessage = `Invalid request: ${error.message}`
      break
    case 'StripeAuthenticationError':
      errorMessage = `Authentication error: ${error.message}`
      break
    case 'StripeRateLimitError':
      errorMessage = `Rate limit exceeded: ${error.message}`
      break
    case 'StripeConnectionError':
      errorMessage = `Network error: ${error.message}`
      break
    case 'StripeAPIError':
      errorMessage = `Stripe Generic API error: ${error.message}`
      break
    case 'StripeResourceAlreadyExists':
      errorMessage = `Customer with this email already exists: ${error.message}`
      break
    case 'StripeParameterMissing':
      errorMessage = `Missing required parameter: ${error.message}`
      break
  }
  return errorMessage
}

export { createStripeCustomer, addPaymentMethod, attachPaymentMethodToUser, createPaymentIntent, cancelSubscription }
