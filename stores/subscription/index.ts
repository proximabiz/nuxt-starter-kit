import type { ActivePlanType, AddAPIPayload, CancelAPIPayload, CompleteOrderPostAPIPayload, State } from './types'
import type { Database } from '~/types/supabase'

function initialState() {
  return {
    subscriptionStatus: { planName: '', planStatus: '' },
    activePlan: {
      id: '',
      user_id: '',
      amount: 0,
      plan_start_date: '',
      plan_end_date: '',
      auto_renew: false,
      is_subscription_active: false,
      sub_key: null,
      name: '',
      description: '',
      monthly_price: 0,
      status: false,
      features: null,
      yearly_price: 0,
      subscription_status: '',
    },
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
      cardNo: 0,
      expDate: '',
      cvv: 0,
      taxId: '',
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

      // FIXME:: Find better way to handle this
      if (!userId) {
        return new Promise((resolve) => {
          return resolve(initialState().activePlan)
        })
      }

      const supabaseClient = useSupabaseClient<Database>()

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_subscription', {
        userid: userId as string,
      })

      if (supabaseError)
        throw supabaseError

      const response = supabaseResponse as ActivePlanType
      this.subscriptionStatus.planStatus = response?.subscription_status
      this.subscriptionStatus.planName = response?.name

      return response
    },

    async addSubscription(payload: AddAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async cancelSubscription(payload: CancelAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/subscriptions/cancel', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
    async completeOrder(payload: CompleteOrderPostAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/complete-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
