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
