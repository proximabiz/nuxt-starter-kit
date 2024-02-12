import type { DiagramType, State } from './types'

export const useDiagramStore = defineStore('diagramStore', {
  state: (): State => ({
    types: [],
  }),
  getters: {
    getTypes(): Array<any> {
      return this.types
    },

    getMindMapTypeDiagram(): DiagramType | undefined {
      return this.types.find(item => item.name === 'Mind Elixir')
    },
  },
  actions: {
    async list(): Promise<void> {
      const supabaseClient = useSupabaseClient()

      const { data: supabaseResponse, error: diagramError } = await supabaseClient
        .from('diagram_type')
        .select()

      if (diagramError)
        throw diagramError

      this.types = supabaseResponse
    },
    async getVersionList(diagramId: string): Promise<void> {
      const supabaseClient = useSupabaseClient()

      const { data: supabaseResponse, error: diagramError } = await supabaseClient
        .from('diagram_version')
        .select()
        .eq('diagram_id', diagramId as string)
        .order('updated_at', { ascending: false })

      if (diagramError)
        throw diagramError

      return supabaseResponse
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
