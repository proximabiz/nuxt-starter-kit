import type { BillingState, State, cancelSubPayload, subDetails, subScriptionPayload } from './types'

export const useBillingStore = defineStore({
  id: 'paymentAddressState',
  state: (): State => ({
    subscriptionStatus: { planName: '', planStatus: '' },
    billingDetails: {
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
    },
  }),
  getters: {
    GET_ADDRESS_AND_CARD_DETAILS(): BillingState {
      return this.billingDetails
    },
    GET_SUB_STATUS(): subDetails {
      return this.subscriptionStatus
    },
  },
  actions: {
    async fetchActivePlan() {
      const authStore = useAuthStore()
      const userId = authStore.getAuthUser.value?.id
      const supabaseClient = useSupabaseClient()
      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_subscription', { userid: userId })
      if (supabaseError)
        throw supabaseError
      this.subscriptionStatus.planStatus = supabaseResponse.subscription_status
      this.subscriptionStatus.planName = supabaseResponse.name
      return supabaseResponse
    },
    async addSubscription(payload: subScriptionPayload) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })
      if (error.value)
        throw error.value
      return data.value
    },
    async cancelSubscription(payload: cancelSubPayload) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/subscriptions/cancel', {
        method: 'PATCH',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,

      })
      if (error.value)
        throw error.value
      return data.value
    },
    async clearSubscription() {
      this.subscriptionStatus.planName = ''
      this.subscriptionStatus.planStatus = ''
    },
  },
})
