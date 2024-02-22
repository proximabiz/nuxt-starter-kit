export interface putPayload {
  country: string
  zipcode: string
  city: string
  region: string
  address: string
  phoneNumber: string
}
export interface postPayload {
  name: string
  organisationName: string
  country: string
  zipcode: string
  city: string
  region: string
  address: string
  phoneNumber: string
}
export interface State {
  allAddressDetails: postPayload
}
