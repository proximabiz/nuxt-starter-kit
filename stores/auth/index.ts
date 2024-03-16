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
  },
  actions: {},
  persist: {
    storage: persistedState.localStorage,
  },
})
