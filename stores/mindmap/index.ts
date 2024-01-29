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
      const authStore = useAuthStore()

      const { data, error } = await useFetch('/api/diagram', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authStore.session.access_token}`,
        },
      })
      if (error.value)
        throw error.value

      this.maps = data.value?.data || null
    },

    async get(payload: getAPIPayload) {
      const authStore = useAuthStore()

      const { data, error } = await useFetch(`/api/diagram/${payload.diagramId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authStore.session.access_token}`,
        },
      })
      if (error.value)
        throw error.value

      return data.value?.data
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
