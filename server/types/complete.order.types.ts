export interface OrderType {
  userId: string
  email: string
  firstName: string
  lastName: string
  planType: 'monthly' | 'yearly'
  expiryMonth: number
  expiryYear: number
  cardNumber: string
  securityCode: string
  cardHolderName: string
  country: string
  region: string
  city: string
  zipcode: string
  address: string
  phoneNumber: string
  subscriptionTypeId: string
  amount: number
  currencyCode: string
  currentDate: Date
  endDate: Date
  gstNumber: string
}

export interface StripeCustomer {
  id: string
  // Define other properties as needed
}

export interface UserStripeDetails {
  user_id: string
  stripe_user_id?: string
  stripe_payment_method_id?: string
  has_payment_method_active?: boolean
}

export interface SubscriptionDetails {
  userId?: string
  subscriptionTypeId: string
  itemPriceId: string
  amount: number
  currentDate?: Date
  endDate?: Date
  currencyCode?: string
  planType?: string
  chargebeeSubId?: string
  object?: string
}

export interface TransactionDetails {
  transactionId?: string
  paymentSourceId?: string
  paymentMethod?: string
  gateway?: string
  transactionStatus?: string
}
