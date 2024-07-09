export interface TaxPostAPIPayload {
  gstNumber: string
}

export interface AddressPutAPIPayload {
  name: string
  orgname: string
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
}

export interface UserAddress {
  address: string
  city: string
  country: string
  id: string
  is_active: boolean
  phone_number: string
  region: string
  user_id: string
  zip_code: string
}

export interface UserDetails {
  id: string
  user_id: string
  name: string
  organisation_name: string
  gst_number: string
  is_active: boolean
}

export enum AuthProviders {
  Email = 'email',
  Google = 'google',
}

export interface Identity {
  identity_id: string
  id: string
  user_id: string
  identity_data: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  provider: string
  last_sign_in_at: string
  created_at: string
  updated_at: string
  email: string
}
export interface UserData {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  confirmation_sent_at: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: AuthProviders[]
  }
  user_metadata: object
  identities: Identity[]
  created_at: string
  updated_at: string
}

export interface UserAddressType {
  address: string
  city: string
  country: string
  gst_number: string
  name: string
  organisation_name: string
  phone_number: string
  region: string
  zip_code: string
}

export interface EditAddressResponseType {
  id: string
  country: string
  zip_code: string
  city: string
  region: string
  address: string
  created_at: string
  updated_at: string
  is_active: boolean
  user_id: string
  phone_number: string
}

export interface AddAddressResponseType {
  id: string
  country: string
  zip_code: string
  city: string
  region: string
  address: string
  created_at: string
  updated_at: string
  is_active: boolean
  user_id: string
  phone_number: string
}

export interface GetTaxGSTResponseType {
  gst_number: string
}

export interface InsertUpdateAddressPayload {
  param_country: string
  param_zip_code: string
  param_city: string
  param_region: string
  param_address: string
  param_phone_number: string
  param_name: string | undefined
  param_organisation_name: string | undefined
  param_user_id: string | undefined
}
