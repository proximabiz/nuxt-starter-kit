import type { BillingProps, DiagramCountLimit, State } from './types'

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
    }) {
      this.propObject = newObject
    },
  },
})

export const useDiagramCountLimit = defineStore('diagramCount', {
  state: (): DiagramCountLimit => ({
    diagramDetails: {
      name: '',
      count: 0,
    },
  }),
  actions: {
    setDiagramDetails(newObject: {
      name: string
      count: number
    }) {
      this.diagramDetails = newObject
    },
  },
})
