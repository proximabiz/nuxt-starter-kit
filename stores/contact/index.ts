import type { State, createAPIPayload } from './types'

function initialState() {
  return {}
}

export const useContactStore = defineStore('contactStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async create(payload: createAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/contact', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
