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
}

export interface getAPIPayload {
  diagramId: string
}

export interface createAPIPayload {
  title: string
  diagramTypeId: string
}

export interface updateAPIPayload {
  diagramId: string
  title: string
  isDetailed: boolean
  details: string
}

export interface saveAPIPayload {
  diagramId: string
  existingOpenAIResponse: any
  isDiagramChanged: boolean
}

export interface State {
  diagramsList: Diagram[] | null
}
