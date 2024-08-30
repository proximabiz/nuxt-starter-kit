export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Diagram {
  created_at: string
  details: string | null
  diagram_type_id: string | null
  id: string
  keywords: Json | null
  response: Json | null
  title: string | null
  updated_at: string | null
  user_id: string | null
  active_status: boolean
}

export interface getAPIPayload {
  diagramId: string
}

export interface createAPIPayload {
  title: string
  diagramTypeId: string
  subTypeId:string
}

export interface updateAPIPayload {
  diagramId: string
  title: string
  isDetailed?: boolean
  details?: string
}

export interface saveAPIPayload {
  diagramId: string
  existingOpenAIResponse: any
  isDiagramChanged: boolean
}

export interface DiagramsList {
  total_diagrams_count: number
}
export interface State {
  diagramsList: Diagram[] | null
  activeDiagrams: Diagram[] | null
  deletedDiagrams: Diagram[] | null
  diagramsCountList: {
    allowedCount: number
    currentCount: number
    planType: string
  }
}

export interface CreateDiagramResponseType {
  diagram: Array<Diagram>
}

export interface UpdateDiagramResponseType {
  data: Array<Diagram>
  response: {
    chartDetails: Array<any>
    isDetailed: boolean
    userRequirement: string
  }
}
export interface GetDiagramsCountType {
  status: number
  message: string
  currentCount: number
  allowedCount: number
  planType: string
}
