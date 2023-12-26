export interface Task {
  id: number
  title: string
  isFav: boolean
}

export interface State {
  name: string
  tasks: Task[]
}
