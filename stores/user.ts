import { logger } from '~/utility/logger'

interface State {
  userList: any[]
}

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
        const { data, error } = await useFetch<any[]>('/api/user/list', {
          method: 'get',
        })

        if (error.value) {
          logger.error('Failed to fetch users:', error.value)
          return
        }

        console.log(data.value)

        this.userList = data.value ? data.value : []

        console.log(this.userList)
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
