import type { State, addressPayload } from './types'
import { logger } from '~/utility/logger'
import { useAuthStore } from '~/stores'

function initialState() {
  return {
    address: null,
  }
}

export const useAddressStore = defineStore({

  id: 'address',
  state: (): State => initialState(),
  getters:{},
  actions: {   
    async fetchAddress():Promise<void> {
      const authStore = useAuthStore()
      const supabaseClient = useSupabaseClient()
      
      // const address = {};
      const { data: supabaseUserAddress, error: supabaseError } = await supabaseClient
        .from('user_address_details')
        .select()
        .eq('user_id', authStore.getAuthUser.value?.id as string)
        const { data: supabaseUserDetails, error: supabaseAddressError } = await supabaseClient
        .from('user_details')
        .select()
        .eq('user_id', authStore.getAuthUser.value?.id as string)

      if (supabaseError)
        throw supabaseError
      return supabaseUserAddress[0]
    }
    // async fetchAddress() {
    //   try {
    //     const authStore = useAuthStore()
    //     const { data, error } = await useFetch('/api/user/address-contact', {
    //       method: 'GET',
    //       headers: {
    //         Authorization: await authStore.getBearerToken,
    //       },
    //     })
    //     if (error.value) {
    //       logger.error('Failed to fetch address:', error.value)
    //       return
    //     }
    //     // console.log("123 updating",data.value.userData)
    //     return this.AddressDetails = data.value ? data?.value : []
    //   }
    //   catch (err) {
    //     logger.error('Error fetching address:', err)
    //   }
    // },
    // async editAddress(payload: addressPayload) {
    //   const authStore = useAuthStore()
    //   const { data, error } = await useFetch('/api/user/address', {
    //     method: 'PUT',
    //     headers: {
    //       Authorization: await authStore.getBearerToken,
    //     },
    //     body: payload,
    //   })
    //   if (error.value)
    //     throw error.value
    //   return data.value
    // },

    // async addAddress(payload: addressPayload) {
    //   const authStore = useAuthStore()
    //   const { data, error } = await useFetch('/api/user/address', {
    //     method: 'PUT',
    //     headers: {
    //       Authorization: `Bearer ${authStore.session.access_token}`,
    //     },
    //     body: payload,
    //   })
    //   if (error.value)
    //     throw error.value
    //   return data.value
    // },
    
  }, 
})
