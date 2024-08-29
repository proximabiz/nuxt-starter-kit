export interface ChargebeeProductFamilyType {
  proFamId: string
  descp: string
  name: string
}

export interface ChargebeeItemType {
  itemId: string
  itemName: string
  description: string
  productFamily: string
}

export interface ChargebeeItemPriceType {
  priceId: string
  itemId: string
  name: string
  price: number
  currencyCode: string
  period: number
  periodUnit: string
}
