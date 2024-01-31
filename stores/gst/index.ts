import type {State, taxGst } from './types'
import { logger } from '~/utility/logger'

export const useGstTaxStore = defineStore({
    id: 'gst',
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
          const { data, error } = await useFetch('/api/user/gst', {
            method: 'GET',
            headers: {
              Authorization: await authStore.getBearerToken,
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
            Authorization: await authStore.getBearerToken,
          },
          body: payload,
        })
        if (error.value)
          throw error.value
        return data.value
      },
  
      async deleteTaxGst(payload: taxGst) {
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
    }, 
  })
  
