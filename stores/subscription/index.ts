import type { BillingState,subScriptionPayload,cancelSubPayload } from './types'

export const useBillingStore = defineStore({
  id: 'paymentAddressState',
  state: (): BillingState => ({
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
    async fetchActivePlan(){
      const authStore = useAuthStore()
      const userId=authStore.getAuthUser.value?.id
      const supabaseClient = useSupabaseClient()
      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_subscription', { userid: userId })
      if (supabaseError)
        throw supabaseError
    return supabaseResponse
  },
  async addSubscription(payload:subScriptionPayload){
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
  async cancelSubscription(payload:cancelSubPayload){  
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
  }
}
})
