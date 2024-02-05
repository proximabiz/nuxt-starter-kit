import type { State } from './types'
import { logger } from '~/utility/logger'

export const usePlanStore = defineStore({
  id: 'plan',
  state: (): State => ({
    planDetails: [],
  }),
  getters: {},
  actions: {
    async fetchActivePlan(): Promise<any> {
      try {
        const authStore = useAuthStore()
        const { data, error } = await useFetch('/api/user/subscription', {
          method: 'GET',
          headers: {
            Authorization: await authStore.getBearerToken,
          },
        })
        if (error.value) {
          logger.error('Failed to fetch active plan:', error.value)
          return
        }
        console.log('123 updating', data)
        return data
      }
      catch (err) {
        logger.error('Error fetching active plan:', err)
      }
    },

  },
})
