export interface OrderType {
  userId: string
  email: string
  name: string
  planType: 'monthly' | 'yearly'
  expiryDate: string
  cardNumber: string
  securityCode: string
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
  user_id: string
  sub_type_id: string
  amount: number
  plan_start_date: Date
  plan_end_date: Date
  currency: string
  plan_type: string
}

export interface PaymentIntent {
  statusCode: number
  status: string
  paymentId: string
}
