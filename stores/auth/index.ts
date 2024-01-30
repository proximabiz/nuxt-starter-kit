import type { State, signInViaEmailPasswordPayload, signupViaEmailPasswordPayload } from './types'

function initialState() {
  return {
    session: {
      access_token: '',
      expires_at: 1705059652,
      expires_in: 0,
      refresh_token: '',
      token_type: '',
    },
    authUser: {
      aud: '',
      created_at: '',
      email: '',
      email_confirmed_at: '',
      id: '',
      last_sign_in_at: '',
      phone: '',
      role: '',
      updated_at: '',
      user_metadata: {},
    },
  }
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => initialState(),
  getters: {
    isLoggedIn(): string {
      return this.session.access_token
    },

    getAuthUser() {
      return useSupabaseUser()
    },

    async getBearerToken() {
      const supabaseClient = useSupabaseClient()
      const session = await supabaseClient.auth.getSession()
      return `Bearer ${session.data.session?.access_token}`
    },
  },
  actions: {
    async signup(payload: signupViaEmailPasswordPayload) {
      const { data, error } = await useFetch('/api/user/signup', {
        method: 'POST',
        body: payload,
      })

      if (error.value)
        throw error.value

      if (data.value?.data?.session)
        this.session = data.value.data.session
      if (data.value?.data.session?.user)
        this.authUser = data.value?.data.session?.user
    },

    async signIn(payload: signInViaEmailPasswordPayload) {
      const { data, error } = await useFetch('/api/user/signin', {
        method: 'POST',
        body: payload,
      })

      if (error.value)
        throw error.value

      if (data.value?.data?.session)
        this.session = data.value.data.session
      if (data.value?.data.session?.user)
        this.authUser = data.value?.data.session?.user
    },

    async signOut() {
      const { error } = await useFetch('/api/user/signout', {
        method: 'GET',
      })

      if (error.value)
        throw error.value

      this.session = initialState().session
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
