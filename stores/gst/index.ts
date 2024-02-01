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
      async fetchTaxGst():Promise<any> {
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
         return this.GstDetails = data.value ? data?.value?.data as taxGst[] : []
        }
        catch (err) {
          logger.error('Error fetching address:', err)
        }
      },
      async addTaxGst(payload: taxGst) {
        const authStore = useAuthStore()
        const { data, error } = await useFetch('/api/user/gst', {
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
  
      async deleteTaxGst() {
        const authStore = useAuthStore()
        const { data, error } = await useFetch('/api/user/gst', {
          method: 'DELETE',
          headers: {
            Authorization: await authStore.getBearerToken,
          },
         
        })
        if (error.value)
          throw error.value
        return data.value
      },
    }, 
  })
  
