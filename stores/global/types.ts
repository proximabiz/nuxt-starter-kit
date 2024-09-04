interface pageHeadingType {
  title: string
}

export interface State {
  pageHeading: pageHeadingType
}

export interface BillingProps {
  propObject: {
    plan: string
    price: number
    month: number
    disabled: boolean
    calculatedPrice: string
    currencySymbol: string
    planType: string
    currencyCode: string
    id: string
  }
}
