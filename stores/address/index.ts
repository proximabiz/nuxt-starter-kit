import type { State, addressPayload } from './types'
import { logger } from '~/utility/logger'
import { useAuthStore } from '~/stores'

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
      try {
        const authStore = useAuthStore()
        const { data, error } = await useFetch('/api/user/address-contact', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.session.access_token}`,
          },
        })
        if (error.value) {
          logger.error('Failed to fetch address:', error.value)
          return
        }
        // console.log("123 updating",data.value.userData)
        return this.AddressDetails = data.value ? data?.value : []
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
          Authorization: `Bearer ${authStore.session.access_token}`,
        },
        body: payload,
      })
      if (error.value)
        throw error.value
      return data.value
    },

    async addAddress(payload: addressPayload) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/user/address', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.session.access_token}`,
        },
        body: payload,
      })
      if (error.value)
        throw error.value
      return data.value
    },
  }, 
})
