export interface UserInfo {
  name: string
  age: number
}

export interface Task {
  id: number
  title: string
  isFav: boolean
}

export interface State {
  userList: UserInfo[]
  user: UserInfo | null
  name: string
  tasks: Task[]
}
