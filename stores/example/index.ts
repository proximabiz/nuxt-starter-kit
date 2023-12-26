import type { State, Task } from './types'

export const useTaskStore = defineStore('taskStore', {
  state: (): State => ({
    name: 'mario',
    tasks: [
      { id: 1, title: 'buy some milk', isFav: false },
      { id: 2, title: 'play Gloomhaven', isFav: true },
    ],
  }),
  getters: {
    GET_FAVS(): Array<Task> {
      return this.tasks.filter(t => t.isFav)
    },
    GET_FAV_COUNT(): number {
      return this.tasks.reduce((p, c) => {
        return c.isFav ? p + 1 : p
      }, 0)
    },
    GET_TOTAL_COUNT: state => state.tasks.length,
  },
  actions: {
    ADD_TASK(task: { id: number, title: string, isFav: boolean }) {
      this.tasks.push(task)
    },
    DELETE_TASK(id: number) {
      this.tasks = this.tasks.filter((t) => {
        return t.id !== id
      })
    },
    TOGGLE_FAV(id: number) {
      const task = this.tasks.find(t => t.id === id)

      if (task)
        task.isFav = !task.isFav
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
