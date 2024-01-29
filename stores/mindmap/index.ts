import type { State } from './types'

interface getAPIPayload {
  diagramId: string
}

interface createAPIPayload {
  title: string
  diagramTypeId: string
}

function initialState() {
  return {
    maps: null,
  }
}

export const useMindmapStore = defineStore('mindmapStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async list(): Promise<void> {
      const supabaseClient = useSupabaseClient()
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: diagramError } = await supabaseClient
        .from('diagrams')
        .select()
        .eq('user_id', authStore.getAuthUser.value?.id as string)

      if (diagramError)
        throw diagramError

      this.maps = supabaseResponse
    },

    async get(payload: getAPIPayload) {
      const supabaseClient = useSupabaseClient()

      const { data: supabaseResponse, error: diagramError } = await supabaseClient
        .from('diagrams')
        .select()
        .eq('id', payload.diagramId)

      if (diagramError)
        throw diagramError

      return supabaseResponse
    },

    async create(payload: createAPIPayload) {
      const authStore = useAuthStore()

      const { data, error } = await useFetch('/api/diagram/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.session.access_token}`,
        },
        body: payload,
      })
      if (error.value)
        throw error.value

      return data.value?.data
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
