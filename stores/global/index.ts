import type { State,contactTypes } from './types'

export const useGlobalStore = defineStore('globalStore', {
  state: (): State => ({
    drawer: false,
   
  }),
  getters: {
    GET_DRAWER_STATUS(): boolean {
      return this.drawer
    },
   
  },
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    async contactSales(payload: contactTypes) {
      const authStore = useAuthStore()
      const { data, error } = await useFetch('/api/contact', {
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

  persist: {
    storage: persistedState.localStorage,
  },
})
