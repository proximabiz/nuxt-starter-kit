import { Stripe } from 'stripe'

const stripeInstance = new Stripe('sk_test_51OdqycSA9XKEVEBUvVl6KDV9nW5sNr3bHjRh9htCioXMC9YkQzP6o9xN9OPTVfkqhzhdNE6AQqrF9c0I1OCZcxzY0011diWopS')

export async function createStripeCustomer(email: string, name: string) {
  try {
    const customer = await stripeInstance.customers.create({
      email,
      name,
    })
    return customer
  }
  catch (error) {
    console.error('Error creating customer:', error)
    return { error: 'Could not create customer' }
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
    return paymentMethod
  }
  catch (error) {
    console.error('Error creating payment method:', error)
    return { error: 'Could not create payment method' }
  }
}

export async function attachPaymentMethodToUser(stripeCustomerId: string, stripePaymentMethodId: string) {
  try {
    const attachedPaymentMethod = await stripeInstance.paymentMethods.attach(
      stripePaymentMethodId,
      { customer: stripeCustomerId },
    )

    return attachedPaymentMethod
  }
  catch (error) {
    console.error('Error attaching payment method to customer:', error)
    return { error: 'Could not attach payment method to customer' }
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
    return paymentIntent
  }
  catch (error) {
    console.error('Error creating payment intet:', error)
    return { error: 'Could not create payment intent' }
  }
}
