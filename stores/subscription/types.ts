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
  cardNo: string
  expDate: string
  cvv: string
}
export interface AddAPIPayload {
  userId: string
  subscriptionTypeId: string
  amount: number
}
export interface CancelAPIPayload {
  userId: string
  userSubscriptionId: string
  note: string
}
export interface SubscriptionStatus {
  planName: string
  planStatus: string
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
}
