import stripe, { Stripe } from 'stripe'

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
const stripeInstance = new Stripe('sk_test_51OdqycSA9XKEVEBUvVl6KDV9nW5sNr3bHjRh9htCioXMC9YkQzP6o9xN9OPTVfkqhzhdNE6AQqrF9c0I1OCZcxzY0011diWopS')

export async function createStripeCustomer(email: string, name: string) {
  try {
    const customer = await stripeInstance.customers.create({
      email,
      name,
    })
    return { status: 'Success', statusCode: 200, customer }
  }
  catch (error: any) {
    console.error('Error creating customer:', error.message)
    let errorMessage = `Could not attach payment method to customer : ${error.message}`
    if (error.code === 'parameter_missing')
      errorMessage = 'Missing required parameter:'

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

export async function addPaymentMethod(cardNumber: string, expMonth: number, expYear: number, cvc: string) {
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
    let errorMessage = `Could not attach payment method to customer : ${error.message}`

    if (error.code === 'network_error')
      errorMessage = `Network error : ${error.message}`

    if (error.code === 'authentication_error')
      errorMessage = `Authentication error : ${error.message}`

    if (error.code === 'parameter_missing')
      errorMessage = `Missing required parameter: ${error.message}`

    if (error.code === 'resource_already_exists')
      errorMessage = `Customer with this email already exists: ${error.message}`

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

export async function attachPaymentMethodToUser(stripeCustomerId: string, stripePaymentMethodId: string) {
  try {
    const attachedPaymentMethod = await stripeInstance.paymentMethods.attach(
      stripePaymentMethodId,
      { customer: stripeCustomerId },
    )
    return { status: 'Success', statusCode: 200, attachedPaymentMethod }
  }
  catch (error: any) {
    console.error('Error attaching payment method to customer:', error)
    let errorMessage = 'Could not attach payment method to customer'
    if (error instanceof stripeInstance.errors.StripeCardError)
      errorMessage = error.message

    else if (error instanceof stripeInstance.errors.StripeInvalidRequestError)
      errorMessage = 'Invalid request to Stripe'

    return { status: 'Error', statusCode: error.statusCode, errorMessage }
  }
}

export async function createPaymentIntent(amount: number, currency: string, paymentMethodId: string, userEmail: string) {
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
  catch (error) {
    console.error('Error creating payment intet:', error)
    return { error: 'Could not create payment intent' }
  }
}
