interface pageHeadingType {
  title: string
}

export interface contactTypes {
  name: string
  email: string
  phoneNumber: string
  requestFor: string
  message: string
}

export interface State {
  contactUs: contactTypes
  drawer: boolean
  pageHeading: pageHeadingType
}
