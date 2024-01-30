export interface Address {
    name: string
    organisation_name: string
    country:string
    state:string
    zipcode: string
    city: string
    region:string
    address:string
    phone:string
    email:string
  }
  export interface addressPayload{
    country:string
    state:string
    zipcode: string
    city: string
    region:string
    address:string
    phone:string 
  }
  export interface State {
    AddressDetails: Address[]
  }