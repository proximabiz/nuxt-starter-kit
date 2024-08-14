import type { ActivePlanType, AddAPIPayload, AddNewCardPayload, CancelAPIPayload, CompleteOrderPostAPIPayload, DeleteCardDetailsPayload, GetCardDetails, State } from './types'
import type { Database } from '~/types/supabase'

function initialState() {
  return {
    subscriptionStatus: { planName: '', planStatus: '', limitDiagrams: 0 },
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
      this.subscriptionStatus.limitDiagrams = response.name === 'Basic' ? 4 : response.name === 'Free' ? 8 : response.name === 'Premium' ? 8 : 0
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
    async getCountryCurrencyData() {
      const { data, error } = await useFetch('https://open.er-api.com/v6/latest/USD', {
        method: 'GET',
      })
      if (error.value)
        throw error.value

      return data.value
    },

    async getCardDetailsAPI(): Promise<GetCardDetails> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token
      const getRefreshToken = (await supabaseClient.auth.getSession()).data.session?.refresh_token
      const cookie = `sb-access-token=${accessToken}; sb-refresh-token=${getRefreshToken}`
      const user_id = (await supabaseClient.auth.getSession()).data.session?.user?.id
      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/user/card/${user_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookie,
        },
      })
      if (supabaseError.value)
        throw supabaseError.value
      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async addNewCardDetails(payload: AddNewCardPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token
      const getRefreshToken = (await supabaseClient.auth.getSession()).data.session?.refresh_token
      const cookie = `sb-access-token=${accessToken}; sb-refresh-token=${getRefreshToken}`
      const user_id = (await supabaseClient.auth.getSession()).data.session?.user?.id
      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/user/card/${user_id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookie,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async deleteCardDetails() {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token
      const getRefreshToken = (await supabaseClient.auth.getSession()).data.session?.refresh_token
      const cookie = `sb-access-token=${accessToken}; sb-refresh-token=${getRefreshToken}`
      const user_id = (await supabaseClient.auth.getSession()).data.session?.user?.id

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/user/card/${user_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookie,
        },
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
