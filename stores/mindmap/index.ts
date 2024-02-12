import type { State } from './types'

interface getAPIPayload {
  diagramId: string
}

interface createAPIPayload {
  title: string
  diagramTypeId: string
}

interface updateAPIPayload {
  title: string
  // diagramTypeId: string
}

// interface saveAPIPayload {
//   existingOpenAIResponse: json
// }

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

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient
        .from('diagrams')
        .select()
        .eq('user_id', authStore.getAuthUser.value?.id as string)

      if (supabaseError)
        throw supabaseError

      this.maps = supabaseResponse
    },

    async get(payload: getAPIPayload) {
      const supabaseClient = useSupabaseClient()

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient
        .from('diagrams')
        .select()
        .eq('id', payload.diagramId)

      if (supabaseError)
        throw supabaseError

      return supabaseResponse
    },

    async create(payload: createAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/diagram/create', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value?.data
    },

    async update(payload: updateAPIPayload, diagramId) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/diagram/${diagramId}`, {
        method: 'PUT',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value?.data
    },
    async save(payload, diagramId) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/diagram/${diagramId}`, {
        method: 'PATCH',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value?.data
    },
    async delete(payload: getAPIPayload) {
      const supabaseClient = useSupabaseClient()

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient
        .from('diagrams')
        .delete()
        .eq('id', payload.diagramId)

      if (supabaseError)
        throw supabaseError

      return supabaseResponse
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
