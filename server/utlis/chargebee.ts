import { ChargeBee } from 'chargebee-typescript'
import type { OrderType } from '../types/complete.order.types'
import { PaymentGatwayID } from '../types/enum'
import type { UserCardDetailType } from '../types/user.card.details.types'

const chargebee = new ChargeBee()

chargebee.configure({
  site: process.env.CHARGEBEE_SITE ?? '',
  api_key: process.env.CHARGEBEE_API_KEY ?? '',
  product_catalog_version: process.env.CHARGEBEE_PRODUCT_CATLOG_VERSION ?? '',
})

// ***** Create customer with basic information we can add more details like billing address and stuff
async function createChargebeeCustomer(orderDetails: OrderType) {
  try {
    const [cFirstName, cLastName] = orderDetails.cardHolderName.split(' ')
    const res = await chargebee.customer.create({
      email: orderDetails.email,
      first_name: orderDetails.firstName,
      last_name: orderDetails.lastName,
      card: {
        number: orderDetails.cardNumber,
        expiry_month: orderDetails.expiryMonth,
        expiry_year: orderDetails.expiryYear,
        first_name: cFirstName,
        last_name: cLastName,
        cvv: orderDetails.securityCode,
        gateway_account_id: PaymentGatwayID.CHARGEBEE,
      },
      billing_address: {
        first_name: orderDetails.firstName,
        last_name: orderDetails.lastName,
        email: orderDetails.email,
        phone: orderDetails.phoneNumber,
        city: orderDetails.city,
        country: orderDetails.country,
        zip: orderDetails.zipcode,
        line1: orderDetails.address,
      },
    }).request()
    return { status: 'Success', statusCode: 200, cutomerId: res.customer.id }
  }
  catch (error: any) {
    return { status: 'Error', statusCode: error.statusCode, error }
  }
}

// **** Card details of customer
async function getCustomerCardDetails(chargebeeCustomerId: string) {
  try {
    const cardDetails = await chargebee.card.retrieve(chargebeeCustomerId).request()
    const response = {
      cardNumber: cardDetails.card.masked_number,
      expiryMonth: cardDetails.card.expiry_month,
      expiryYear: cardDetails.card.expiry_year,
      gateway: cardDetails.card.gateway,
      cardType: cardDetails.card.card_type,
      status: cardDetails.card.status,
      fundingType: cardDetails.card.funding_type,
    }
    return { status: 200, data: response }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: `Error getting customer card information: ${error.message}`,
      },
    }
  }
}

// **** Delete customer card details
async function deleteCustomerCardDetails(chargebeeCustomerId: string) {
  try {
    const response = await chargebee.card.delete_card_for_customer(chargebeeCustomerId).request()
    return { status: 200, data: response.customer.card_status }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: `Error removing card details: ${error.message}`,
      },
    }
  }
}

// **** update Card details of customer
async function updateCustomerCardDetails(cardDetails: UserCardDetailType, chargebeeCustomerId: string) {
  try {
    const [cFirstName, cLastName] = cardDetails.cardHolderName.split(' ')
    const response = await chargebee.card.update_card_for_customer(chargebeeCustomerId, {
      gateway_account_id: process.env.CHARGEBEE_GATEWAY_ACCOUNT_ID, // paypal gatway id
      first_name: cFirstName,
      last_name: cLastName,
      number: cardDetails.cardNumber,
      expiry_month: cardDetails.expiryMonth,
      expiry_year: cardDetails.expiryYear,
      cvv: cardDetails.securityCode,
    }).request()
    return { status: 'Success', statusCode: 200, data: response.customer.card_status }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: `Error in updation customer card details: ${error.message}`,
      },
    }
  }
}

//* **** Create Customer Subscription
async function createSubscription(orderDetails: OrderType, customerId: string) {
  try {
    const sub = await chargebee.subscription.create({
      plan_id: `Premium-fcb9588a-38bc-451d-b227-8ddbb2fbcca3`,
      payment_intent: {
        gateway_account_id: PaymentGatwayID.CHARGEBEE,
        payment_method_type: 'chargebee',
      },
      customer: {
        id: customerId,
      },
      payment_method: {
        type: 'card',
      },

    }).request()

    const response = {
      subscriptionId: sub.subscription.id,
    }
    return { status: 'Success', statusCode: 200, subscripton: response }
  }
  catch (error: any) {
    return {
      statusCode: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// ***** Cancel Customer Subscription
async function cancelSubscription(subcriptionId: string) {
  try {
    const subCancel = await chargebee.subscription.cancel(subcriptionId, { end_of_term: true }).request()
    const response = {
      subscriptionId: subCancel.subscription.id,
    }
    return { status: 'Success', statusCode: 200, subscripton: response }
  }
  catch (error: any) {
    return {
      statusCode: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// ******* OTher Usefull Functions ******* //
// get list of customers details
async function listChargebeeCustomers(limit: number = 10) {
  try {
    const response = await chargebee.customer.list({
      limit,
    }).request()
    const customers = response.list.map((item: any) => item.customer)
    return { status: 'Success', statusCode: 200, customers }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// get specific customer details
async function getChargebeeCustomer(customerId: string) {
  try {
    const response = await chargebee.customer.retrieve(customerId).request()
    return { status: 'Success', statusCode: 200, customer: response.customer }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// Delete customer
async function deleteChargebeeCustomer(customerId: string) {
  try {
    const response = await chargebee.customer.delete(customerId).request()
    return { status: 'Success', statusCode: 200, customer: response.customer }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// Create Item/Plan details
async function createChargebeeItemAndPrice(itemData: {
  id: string
  name: string
  description: string
}, itemPriceData: {
  id: string
  item_id: string
  name: string
  price: number
  currency_code: string
  period: number
  period_unit: string
  trial_period?: number
  trial_period_unit?: string
}) {
  try {
    // Create the item
    const itemResponse = await chargebee.item.create({
      id: itemData.id,
      name: itemData.name,
      description: itemData.description,
      item_family_id: 'AFM-Plan', // Optional
      type: 'plan', // Type of item (plan, addon, or charge)
      enabled_in_portal: true,
    }).request()

    // Create the item price
    const itemPriceResponse = await chargebee.item_price.create({
      id: itemPriceData.id,
      item_id: itemPriceData.item_id,
      name: itemPriceData.name,
      price: itemPriceData.price,
      currency_code: itemPriceData.currency_code,
      period: itemPriceData.period,
      period_unit: itemPriceData.period_unit,
      trial_period: itemPriceData.trial_period,
      trial_period_unit: itemPriceData.trial_period_unit,
    }).request()

    return { status: 'Success', statusCode: 200, item: itemResponse.item, itemPrice: itemPriceResponse.item_price }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

// Get all plans/items
async function getPlanDetails() {
  try {
    const response = await chargebee.item.list().request()
    const item = []
    for (let i = 0; i < response.list.length; i++) {
      const entry = response.list[i]
      if (entry.item.status === 'active')
        item.push(entry.item)
    }
    return { status: 'Success', statusCode: 200, plans: item }
  }
  catch (error: any) {
    return {
      status: error.http_status_code || 500,
      error: {
        message: error.message,
      },
    }
  }
}

export { updateCustomerCardDetails, cancelSubscription, deleteCustomerCardDetails, createSubscription, createChargebeeCustomer, listChargebeeCustomers, getChargebeeCustomer, deleteChargebeeCustomer, getCustomerCardDetails, getPlanDetails, createChargebeeItemAndPrice }
