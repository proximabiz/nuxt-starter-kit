import type { State, createAPIPayload } from './types'

function initialState() {
  return {}
}

export const useContactStore = defineStore('contactStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async create(payload: createAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/contact', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
