import type { CreateDiagramResponseType, State, UpdateDiagramResponseType, createAPIPayload, getAPIPayload, saveAPIPayload, updateAPIPayload } from './types'

function initialState() {
  return {
    diagramsList: null,
  }
}

export const useDiagramStore = defineStore('diagramStore', {
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

      this.diagramsList = supabaseResponse
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

    async create(payload: createAPIPayload): Promise<CreateDiagramResponseType | undefined> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/diagram/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async update(payload: updateAPIPayload): Promise<UpdateDiagramResponseType> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/diagram/${payload.diagramId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async save(payload: saveAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/diagram/${payload.diagramId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
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

    async getVersionList(payload: getAPIPayload) {
      const supabaseClient = useSupabaseClient()

      /* @ts-expect-error need to be fixed */
      const { data: supabaseResponse, error: diagramError } = await supabaseClient.rpc('get_diagram_versions', {
        diagramid: payload.diagramId,
      })

      if (diagramError)
        throw diagramError

      return supabaseResponse
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
