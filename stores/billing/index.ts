import type { BillingState,subScriptionPayload } from './types'

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
    async fetchActivePlan():Promise<any>{
      const authStore = useAuthStore()
      const userId=authStore.session?.user.id
      const supabaseClient = useSupabaseClient()
      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_subscription', { user_id: userId })
      if (supabaseError)
        throw supabaseError
    return supabaseResponse[0]
  },
},
// async addSubscription(payload:subScriptionPayload):Promise<any>{

// }
})
