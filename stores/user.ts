import { logger } from '~/utility/logger'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userList: ref<any[]>([]),
  }),
  getters: {
    getUsers: state => state.userList,
  },
  actions: {
    async fetchUsers() {
      try {
        const { data, error } = await useFetch<any[]>('/api/user/list', {
          method: 'get',
        })

        if (error.value) {
          logger.error('Failed to fetch users:', error.value)
          return
        }

        this.userList = data.value || []
      }
      catch (err) {
        logger.error('Error fetching users:', err)
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
