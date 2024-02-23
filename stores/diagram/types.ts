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

export interface State {
  diagramsList: Diagram[] | null
}
