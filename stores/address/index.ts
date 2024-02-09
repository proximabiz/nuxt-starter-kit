import type { State, addressPayload, postPayload } from './types'
import { logger } from '~/utility/logger'
import { useAuthStore } from '~/stores'

export const useAddressStore = defineStore({
  id: 'address',
  state: (): State => ({
    addressDetails: [],
  }),
  getters: {},
  actions: {
    // async fetchAddress():Promise<any> {
    //   const authStore = useAuthStore()
    //   const supabaseClient = useSupabaseClient()

    //   const { data: supabaseUserAddress, error: supabaseUserAddressError } = await supabaseClient
    //     .from('user_address_details')
    //     .select()
    //     .eq('user_id', authStore.getAuthUser.value?.id as string)
    //     const { data: supabaseUserDetails, error: supabaseUserDetailsError } = await supabaseClient
    //     .from('user_details')
    //     .select()
    //     .eq('user_id', authStore.getAuthUser.value?.id as string)

    //   if (supabaseUserAddressError)
    //     throw supabaseUserAddressError
    //   if(supabaseUserDetailsError)
    //   throw supabaseUserDetailsError

    //   let userInfoAddress = supabaseUserAddress.map(address => {
    //   let userDetails = supabaseUserDetails.find(detail => detail.user_id  === address.user_id);
    //   return {...address, ...userDetails};
    // });

    //   return userInfoAddress[0]
    // }
    async fetchAddress(): Promise<any> {
      try {
        const authStore = useAuthStore()
        const { data, error } = await useFetch('/api/user/address-contact', {
          method: 'GET',
          headers: {
            Authorization: await authStore.getBearerToken,
          },
        })
        if (error.value) {
          logger.error('Failed to fetch address:', error.value)
          return
        }

        const allAddressDetails = {
          ...data.value?.userData,
          ...data.value?.userDetails[0],
          ...data.value?.userAddress[0],
        }
        // console.log("123 updating",allAddressDetails)
        // this.addressDetails=allAddressDetails
        return allAddressDetails
      }
      catch (err) {
        logger.error('Error fetching address:', err)
      }
    },
    async editAddress(payload: addressPayload) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/user/address', {
        method: 'PUT',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })
      if (error.value)
        throw error.value
      return data.value
    },

    async addAddress(payload: postPayload) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/user/address-contact', {
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

  },
})
