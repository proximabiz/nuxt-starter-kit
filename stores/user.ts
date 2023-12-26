// stores/counter.js
export const useUserStore = defineStore('user', () => {
  // State
  const list = ref()

  // Getters
  const getList = computed(() => list)

  // Actions
  const fetchUsers = async () => {
    const { data } = await useFetch('/api/user/list', {
      method: 'get',
    })

    list.value = data.value
  }

  return {
    list,
    getList,
    fetchUsers,
  }
}, { persist: {
  key: 'user',
  storage: persistedState.localStorage,
} })
