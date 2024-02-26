export interface TaxPostAPIPayload {
  gstNumber: string
}

export interface AddressPutAPIPayload {
  country: string
  zipcode: string
  city: string
  region: string
  address: string
  phoneNumber: string
}

export interface AddressPostAPIPayload {
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
  GstDetails: TaxPostAPIPayload[]
}
