import type { State } from './types'

function initialState() {
  return {}
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => initialState(),
  getters: {
    isLoggedIn() {
      return this.getAuthUser
    },

    getAuthUser() {
      return useSupabaseUser()
    },

    async getBearerToken() {
      const supabaseClient = useSupabaseClient()
      const session = await supabaseClient.auth.getSession()
      return `Bearer ${session.data.session?.access_token}`
    },
  },
  actions: {},
  persist: {
    storage: persistedState.localStorage,
  },
})
