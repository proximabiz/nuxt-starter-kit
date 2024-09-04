import type { BillingProps, State } from './types'

function initialState() {
  return {
    pageHeading: {
      title: 'My Heading',
    },
  }
}

export const useGlobalStore = defineStore('globalStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {},
  persist: {
    storage: persistedState.localStorage,
  },
})

export const useBillingDetailsStore = defineStore('billingPropsPage', {
  state: (): BillingProps => ({
    propObject: {
      plan: '',
      price: 0,
      month: 0,
      disabled: false,
      calculatedPrice: '',
      currencySymbol: '',
      planType: '',
      currencyCode: '',
      id: '',
    },
  }),
  actions: {
    setPropObject(newObject: {
      plan: string
      price: number
      month: number
      disabled: boolean
      calculatedPrice: string
      currencySymbol: string
      planType: string
      currencyCode: string
      id: string
    }) {
      this.propObject = newObject
    },
  },
})
