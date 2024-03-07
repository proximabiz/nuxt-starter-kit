import type { ActivePlanType, AddAPIPayload, CancelAPIPayload, State } from './types'

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
    async fetchActivePlan(): Promise<ActivePlanType> {
      const authStore = useAuthStore()

      const userId = authStore.getAuthUser.value?.id
      const supabaseClient = useSupabaseClient()

      /* @ts-expect-error need to be fixed */
      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_subscription', {
        userid: userId,
      })

      if (supabaseError)
        throw supabaseError

      const response = supabaseResponse as ActivePlanType
      this.subscriptionStatus.planStatus = response?.subscription_status
      this.subscriptionStatus.planName = response?.name

      return response
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
