import type { AddressState } from './types'

export const useBillingStore = defineStore({
  id: 'paymentAddressState',
  state: (): AddressState => ({
    name: '',
    orgName: '',
    country: '',
    zip: '',
    city: '',
    region: '',
    address: '',
    phone: '',
    cardHolderName: '',
    cardNo: '',
    expDate: '',
    cvv: '',
  }),
  getters: {},
  actions: {
    //  updateForm<T extends keyof AddressState>(field: T, value: AddressState[T]) {
    //     this[field] = value;
    //   },

  },
})
