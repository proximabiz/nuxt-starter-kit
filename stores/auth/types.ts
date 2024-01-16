export interface User {
  aud: string
  created_at: string
  email?: string
  email_confirmed_at?: string
  id: string
  last_sign_in_at?: string
  phone?: string
  role?: string
  updated_at?: string
  user_metadata?: object
}

export interface Session {
  access_token: string
  expires_at?: number | undefined
  expires_in: number | undefined
  refresh_token: string
  token_type: string
}

export interface State {
  session: Session
  authUser: User
}

export interface signupViaEmailPasswordPayload {
  email: string
  password: string
}

export interface signInViaEmailPasswordPayload {
  email: string
  password: string
}
