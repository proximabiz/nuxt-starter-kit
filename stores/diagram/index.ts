import type { CreateDiagramResponseType, Diagram, GetDiagramsCountType, State, UpdateDiagramResponseType, createAPIPayload, getAPIPayload, saveAPIPayload, updateAPIPayload } from './types'
import type { Database } from '~/types/supabase'

function initialState() {
  return {
    diagramsList: null,
    activeDiagrams: [],
    deletedDiagrams: [],
    diagramsCountList: {
      allowedCount: 0,
      currentCount: 0,
      planType: '',
    },
  }
}

export const useDiagramStore = defineStore('diagramStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async list(): Promise<void> {
      const supabaseClient = useSupabaseClient()
      const authStore = useAuthStore()
      const userId = authStore.getAuthUser.value?.id as string

      // Fetch the sub_type_id from the user_subscriptions table
      const { data: subscriptionResponse, error: subscriptionError } = await supabaseClient
        .from('user_subscriptions')
        .select('sub_type_id')
        .eq('user_id', userId)
        .order('id', { ascending: false })
        .single()

      if (subscriptionError)
        throw subscriptionError

      // Fetch the plan_name from the subscription_type table using the sub_type_id
      const { data: subscriptionTypeData, error: subscriptionTypeError } = await supabaseClient
        .from('subscription_type')
        .select('name')
        .eq('id', subscriptionResponse?.sub_type_id)
        .single()

      if (subscriptionTypeError)
        throw subscriptionTypeError

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient
        .from('diagrams')
        .select()
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (supabaseError)
        throw supabaseError

      // Include plan_name in the diagrams data
      const enhancedDiagrams = supabaseResponse.map((diagram: Diagram) => ({
        ...diagram,
        plan_name: subscriptionTypeData?.name
      }))

      this.diagramsList = enhancedDiagrams.filter((el: Diagram) => el.title !== 'default') as Diagram[]
      this.activeDiagrams = enhancedDiagrams.filter((el: Diagram) => el.title !== 'default' && el.active_status === false)
      this.deletedDiagrams = enhancedDiagrams.filter((el: Diagram) => el.title !== 'default' && el.active_status === true)
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
        throw supabaseError.value?.data

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
        // .delete()
        .update({ active_status: true } as never)
        .eq('id', payload.diagramId)

      if (supabaseError)
        throw supabaseError

      return supabaseResponse
    },

    async getVersionList(payload: getAPIPayload) {
      const supabaseClient = useSupabaseClient<Database>()
      const { data: supabaseResponse, error: diagramError } = await supabaseClient.rpc('get_diagram_versions', {
        diagramid: payload.diagramId,
      })

      if (diagramError)
        throw diagramError

      return supabaseResponse
    },

    async getDiagramsCount() {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch(`/api/diagram/diagramsCount`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      const response = supabaseResponse.value as GetDiagramsCountType

      this.diagramsCountList.allowedCount = response?.allowedCount
      this.diagramsCountList.currentCount = response?.currentCount
      this.diagramsCountList.planType = response?.planType

      return supabaseResponse.value
    },

  },
  persist: {
    storage: persistedState.localStorage,
  },
})
