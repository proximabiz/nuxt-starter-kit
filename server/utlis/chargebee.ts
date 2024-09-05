import { ChargeBee } from 'chargebee-typescript'
import type { ChargebeeItemPriceType, ChargebeeItemType, ChargebeeProductFamilyType } from '../types/chargebee.function.types'
import type { OrderType, SubscriptionDetails } from '../types/complete.order.types'
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

    if (!cardDetails || !cardDetails.card)
      return { status: 200, data: {} } // Return empty data when no card details are found

    const firstName = cardDetails.card.first_name || ''
    const lastName = cardDetails.card.last_name || ''

    const response = {
      cardNumber: cardDetails.card.masked_number,
      expiryMonth: cardDetails.card.expiry_month,
      expiryYear: cardDetails.card.expiry_year,
      gateway: cardDetails.card.gateway,
      cardType: cardDetails.card.card_type,
      status: cardDetails.card.status,
      fundingType: cardDetails.card.funding_type,
      cardHolderName: firstName + (lastName ? ` ${lastName}` : ''),
    }

    return { status: 200, data: response }
  }
  catch (error: any) {
    if (error.http_status_code === 404)
      return { status: 200, data: { msg: 'no data' } } // Return empty data if the card is not found

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
    const [cFirstName, cLastName] = cardDetails.cardHolderName.split(' ').length > 1
      ? cardDetails.cardHolderName.split(' ')
      : [cardDetails.cardHolderName, '']

    const response = await chargebee.card.update_card_for_customer(chargebeeCustomerId, {
      gateway_account_id: process.env.CHARGEBEE_GATEWAY_ACCOUNT_ID, // paypal gatway id
      first_name: cFirstName || '',
      last_name: cLastName || '',
      number: cardDetails.cardNumber,
      expiry_month: cardDetails.expiryMonth,
      expiry_year: cardDetails.expiryYear,
      cvv: cardDetails.securityCode,
    }).request()
    const res = {
      cardNumber: response.card.masked_number,
      expiryMonth: response.card.expiry_month,
      expiryYear: response.card.expiry_year,
      gateway: response.card.gateway,
      cardType: response.card.card_type,
      status: response.card.status,
      fundingType: response.card.funding_type,
      cardHolderName: `${cFirstName} ${cLastName}`,
    }
    return { status: 'Success', statusCode: 200, data: res }
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
async function createSubscription(subscription: SubscriptionDetails, customerId: string) {
  try {
    const result = await chargebee.subscription.create_with_items(customerId, {
      subscription_items: [
        {
          item_price_id: subscription.itemPriceId,
          // unit_price: subscription.amount,
        },
      ],
      payment_intent: {
        gateway_account_id: PaymentGatwayID.CHARGEBEE,
        payment_method_type: 'card',
      },
      auto_collection: 'on',
    }).request()

    return { status: 'Success', statusCode: 200, subscripton: result }
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

//* **** Get Customer Subscription
async function getCustomerSubscription(subcriptionId: string) {
  try {
    const response = await chargebee.subscription.retrieve(subcriptionId).request()
    if (!response || !response.subscription)
      return { status: 200, data: { message: 'user don\'t have subscription' } }
    return { status: 'Success', statusCode: 200, subcriptionDetails: response.subscription }
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

// ***** Cancel Customer Subscription
async function cancelSubscription(subcriptionId: string) {
  try {
    const subCancel = await chargebee.subscription.cancel_for_items(subcriptionId, { end_of_term: true }).request()
    const response = {
      status: subCancel.subscription.status,
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

//* **** Get Customer Transaction Details
async function getCustomerTransactionDetails(customerId: string, subcriptionId: string) {
  try {
    const response = await chargebee.transaction.list({
      'limit': 1,
      'customer_id': { is: customerId },
      'subscription_id': { is: subcriptionId },
      'sort_by[desc]': 'date',
    }).request()
    if (!response || !response.list[0].transaction)
      return { status: 200, data: { message: 'user don\'t have transaction details' } }

    return { status: 'Success', statusCode: 200, transactionDetails: response.list[0] }
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

// ******* For Maintaing Product Family with plan and item price in Chargebee side to linkup our's ***********

async function createProductFamily(productFamily: ChargebeeProductFamilyType) {
  try {
    const res = await chargebee.item_family.create({
      id: productFamily.proFamId,
      description: productFamily.descp,
      name: productFamily.name,
    }).request()
    return { status: 'Success', statusCode: 200, family: res.item_family }
  }
  catch (error: any) {
    return { status: 'Error', statusCode: error.statusCode, error }
  }
}

// this is use to create Item or item on chargebee side
async function createItem(item: ChargebeeItemType) {
  try {
    const res = await chargebee.item.create({
      id: item.itemId,
      name: item.itemName,
      description: item.description,
      item_family_id: item.productFamily,
      type: 'plan', // Type of item (plan, addon, or charge)
      enabled_in_portal: true,
    }).request()
    return { status: 'Success', statusCode: 200, item: res.item }
  }
  catch (error: any) {
    return { status: 'Error', statusCode: error.statusCode, error }
  }
}

// this is use to creat item/plan price on chargebee side
async function createItemPrice(itemPrice: ChargebeeItemPriceType) {
  try {
    const res = await chargebee.item_price.create({
      id: itemPrice.priceId,
      item_id: itemPrice.itemId,
      name: itemPrice.name,
      price: itemPrice.price,
      currency_code: itemPrice.currencyCode,
      period: itemPrice.period,
      period_unit: itemPrice.periodUnit,
    }).request()
    return { status: 'Success', statusCode: 200, itemPrice: res.item_price }
  }
  catch (error: any) {
    return { status: 'Error', statusCode: error.statusCode, error }
  }
}

// Get all plans/items Family
async function getIProductFamilyDetails() {
  try {
    const response = await chargebee.item_family.list().request()
    if (!response || response.list.length === 0)
      return { status: 200, data: { message: 'there is no product family' } }
    const item_family = []
    for (let i = 0; i < response.list.length; i++) {
      const entry = response.list[i]
      item_family.push(entry.item_family)
    }
    return { status: 'Success', statusCode: 200, productFamily: item_family }
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

// Get all plans/items Family
async function getProductFamilyDetailsById(planFamilyId: string) {
  try {
    const response = await chargebee.item_family.retrieve(planFamilyId).request()
    if (!response || !response.item_family)
      return { status: 200, data: { message: 'there is no product family details' } }
    return { status: 'Success', statusCode: 200, family: response.item_family }
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
async function getItemDetails() {
  try {
    const response = await chargebee.item.list().request()
    if (!response || response.list.length === 0)
      return { status: 200, data: { message: 'there is no item or plan details' } }
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

// Get plans/items by id
async function getItemDetailsById(planId: string) {
  try {
    const response = await chargebee.item.retrieve(planId).request()
    if (!response || !response.item)
      return { status: 200, data: { message: 'there is no specific item or plan details' } }
    return { status: 'Success', statusCode: 200, plan: response.item }
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

// Get all plans/items prices
async function getItemPriceDetails() {
  try {
    const response = await chargebee.item_price.list().request()
    if (!response || response.list.length === 0)
      return { status: 200, data: { message: 'there is no item price details' } }
    const item = []
    for (let i = 0; i < response.list.length; i++) {
      const entry = response.list[i]
      if (entry.item_price.status === 'active')
        item.push(entry.item_price)
    }
    return { status: 'Success', statusCode: 200, itemPrice: item }
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

// Get plans/items Price by id
async function getItemPriceDetailsById(planPriceId: string) {
  try {
    const response = await chargebee.item_price.retrieve(planPriceId).request()
    if (!response || !response.item_price)
      return { status: 200, data: { message: 'there is no specific itme price details' } }
    return { status: 'Success', statusCode: 200, plans: response.item_price }
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
    if (!response || !response.customer)
      return { status: 200, data: { message: 'there is no customer details' } }
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

// Get customer billing history
async function getListOfTransaction(chargebeeCustomerId: string, limit: number = 100) {
  try {
    const transactions = await chargebee.transaction.list({
      limit,
      customer_id: { is: chargebeeCustomerId },
    }).request()

    if (!transactions || transactions.list.length === 0)
      return { status: 200, data: [] }

    const response = []

    for (const entry of transactions.list) {
      const transaction = entry.transaction

      // Retrieve subscription with subscription id
      const subResponse = await chargebee.subscription.retrieve(transaction.subscription_id).request()
      const plan_id = subResponse.subscription.subscription_items[0].item_price_id

      // Retrieve plan name with plan id
      const itemPriceResponse = await chargebee.item_price.retrieve(plan_id).request()
      const plan_name = itemPriceResponse.item_price.name

      response.push({
        paymentDate: new Date(transaction.date).toISOString(),
        searchedYear: new Date(transaction.date).getFullYear(),
        amount: transaction.amount,
        currencyCode: transaction.currency_code,
        paymentStatus: transaction.status,
        planName: plan_name,
      })
    }
    return { status: 200, data: response }
  }
  catch (error: any) {
    if (error.http_status_code === 404)
      return { status: 200, data: { msg: 'no data' } }

    return {
      status: error.http_status_code || 500,
      error: {
        message: `Error getting customer transaction history: ${error.message}`,
      },
    }
  }
}

export { updateCustomerCardDetails, getCustomerTransactionDetails, getCustomerSubscription, getIProductFamilyDetails, getProductFamilyDetailsById, getItemPriceDetails, getItemPriceDetailsById, getItemDetailsById, createItemPrice, createItem, createProductFamily, cancelSubscription, deleteCustomerCardDetails, createSubscription, createChargebeeCustomer, listChargebeeCustomers, getChargebeeCustomer, deleteChargebeeCustomer, getCustomerCardDetails, getItemDetails, getListOfTransaction }
