export interface ChartResponseType {
  userKeyword: string
  userRequirement: string
  diagramType: string
  chartDetails: object
  isDetailed: boolean
}

export enum DiagramType {
  MINDMAP = 'Mind Mapping',
  FLOWCHART = 'flowchart',
  MINDELIXIR = 'Mind Elixir',
}
