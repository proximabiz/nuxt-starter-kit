import type { State, User } from './types'
import { logger } from '~/utility/logger'

export const useUserStore = defineStore({
  id: 'user',
  state: (): State => ({
    userList: [],
  }),
  getters: {
    getUsers: state => state.userList,
  },
  actions: {
    async fetchUsers() {
      try {
        const { data, error } = await useFetch<User[]>('/api/user/list', {
          method: 'GET',
        })
        if (error.value) {
          logger.error('Failed to fetch users:', error.value)
          return
        }
        this.userList = data.value ? data.value : []
      }
      catch (err) {
        logger.error('Error fetching users:', err)
      }
    },
    async clearUsers() {
      this.userList = []
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
