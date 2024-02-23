export interface DiagramType {
  id: string
  name: string
  description: string
  icon: string
  status: boolean
}

export interface State {
  types: Array<DiagramType>
}
