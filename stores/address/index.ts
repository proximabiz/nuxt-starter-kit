import type { State, Address } from './types'
import { logger } from '~/utility/logger'
import { useAuthStore } from '~/stores'

// const authStore = useAuthStore()

export const useAddressStore = defineStore({
    id: 'address',
    state: (): State => ({
        AddressDetails: [],
    }),
    getters: {
      getAddress: state => state.AddressDetails,
    },
    actions: {
      async fetchAddress() {
        console.log("called from action")
        try {
          const { data, error } = await useFetch<Address[]>('/api/user/address-contact', {
            method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${authStore.session.access_token}`,
        //       },
           })
          if (error.value) {
            logger.error('Failed to fetch address:', error.value)
            return
          }
          console.log("data",data)
          this.AddressDetails = data.value ? data.value : []
        }
        catch (err) {
          logger.error('Error fetching address:', err)
        }
      },
      async clearAddress() {
        this.AddressDetails = []
      },
    },
    persist: {
        storage: persistedState.localStorage,
      },
  })