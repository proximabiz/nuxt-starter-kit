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
export interface subScriptionPayload{
  userId : string,
  subscriptionTypeId : string,
  ammount : number
}
export interface cancelSubPayload{
  userId : string,
  userSubscriptionId : string,
  note : string
}
