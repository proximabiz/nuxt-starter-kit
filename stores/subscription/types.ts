export interface BillingState {
  name: string
  orgName: string
  country: string
  zip: string
  city: string
  region: string
  address: string
  phone: string
  cardHolderName: string
  cardNo: number | string
  expDate: string
  cvv: number | string
  taxId: string
  diagramPercentage: string
  actualDiagramCount: string
}
export interface AddAPIPayload {
  userId: string
  subscriptionTypeId: string
  amount: number
  email: string | undefined
}
export interface CancelAPIPayload {
  userId: string
  userSubscriptionId: string
  note: string
}
export interface SubscriptionStatus {
  planName: string
  planStatus: string
  monthly_price: number
  yearly_price: number
  plan_type: string
  total_diagrams_count: number
  plan_start_date: string
  plan_end_date: string
}
export interface State {
  subscriptionStatus: SubscriptionStatus
  billingDetails: BillingState
}

export interface ActivePlanType {
  id: string
  user_id: string
  amount: number
  plan_start_date: string
  plan_end_date: string
  auto_renew: boolean
  is_subscription_active: boolean
  sub_key: null | string
  name: string
  description: string
  monthly_price: number
  status: boolean
  features: null | string
  yearly_price: number
  subscription_status: string
  plan_type: string
  total_diagrams_count: number
}

export interface CompleteOrderPostAPIPayload {
  country: string
  region: string
  city: string
  zipcode: string
  address: string
  phoneNumber: string
  subscriptionTypeId: string
  planType: string
  currencyCode: string
  cardHolderName: string
  cardNumber: number
  expiryDate: string
  securityCode: number
  taxId: string
}

export interface AddNewCardPayload {
  cardHolderName: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  securityCode: string
}

export interface DeleteCardDetailsPayload {
  id: string
}

export interface GetCardDetails {
  msg: string
  cardHolderName: string
  expiryYear: number
  expiryMonth: number
  cardNumber: string
  id: string
}
