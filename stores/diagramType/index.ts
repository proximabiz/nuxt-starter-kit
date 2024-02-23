import type { DiagramType, State } from './types'

function initialState() {
  return {
    types: [],
  }
}

export const useDiagramTypeStore = defineStore('diagramTypeStore', {
  state: (): State => initialState(),
  getters: {
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
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
