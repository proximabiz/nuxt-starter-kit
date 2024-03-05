import type { State } from './types'

function initialState() {
  return {
    pageHeading: {
      title: 'My Heading',
    },
  }
}

export const useGlobalStore = defineStore('globalStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {},
  persist: {
    storage: persistedState.localStorage,
  },
})
