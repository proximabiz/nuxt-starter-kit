import type {State, taxGst } from './types'
import { logger } from '~/utility/logger'

export const useAddressStore = defineStore({
    id: 'address',
    state: (): State => ({
      GstDetails: [],
    }),
    getters: {
      getGst: state => state.GstDetails,
    },
    actions: {
      async fetchTaxGst() {
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
          return this.GstDetails = data.value ? data?.value : []
        }
        catch (err) {
          logger.error('Error fetching address:', err)
        }
      },
      async AddTaxGst(payload: taxGst) {
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
  
      async addAddress(payload: taxGst) {
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
  
