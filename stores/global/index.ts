import type { State } from './types'

export const useGlobalStore = defineStore('globalStore', {
  state: (): State => ({
    drawer: false,
  }),
  getters: {
    GET_DRAWER_STATUS(): boolean {
      return this.drawer
    },
  },
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
