import type { AddAPIPayload, CancelAPIPayload, State } from './types'

function initialState() {
  return {
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
  }
}

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: (): State => initialState(),
  getters: {},
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

    async addSubscription(payload: AddAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async cancelSubscription(payload: CancelAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/subscriptions/cancel', {
        method: 'PATCH',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,

      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async clearSubscription() {
      this.subscriptionStatus = initialState().subscriptionStatus
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
