import type { AddressPostAPIPayload, AddressPutAPIPayload, State, TaxPostAPIPayload } from './types'

function initialState() {
  return {
    GstDetails: [],
  }
}

export const useUserStore = defineStore('userStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async fetchTaxGst() {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'GET',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      this.GstDetails = supabaseResponse.value ? supabaseResponse?.value?.data as TaxPostAPIPayload[] : []

      return supabaseResponse.value
    },

    async addTaxGst(payload: TaxPostAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async deleteTaxGst() {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'DELETE',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async fetchAddress() {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address-contact', {
        method: 'GET',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async editAddress(payload: AddressPutAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address', {
        method: 'PUT',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async addAddress(payload: AddressPostAPIPayload) {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address-contact', {
        method: 'POST',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async clearAddress() {
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
