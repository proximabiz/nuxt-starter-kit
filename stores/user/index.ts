import type { AddAddressResponseType, AddressPostAPIPayload, AddressPutAPIPayload, GetTaxGSTResponseType, State, TaxPostAPIPayload, UserAddressType } from './types'

function initialState() {
  return {
  }
}

export const useUserStore = defineStore('userStore', {
  state: (): State => initialState(),
  getters: {},
  actions: {
    async fetchTaxGst(): Promise<GetTaxGSTResponseType> {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'GET',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
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

    async fetchAddress(): Promise<UserAddressType> {
      const authStore = useAuthStore()

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address-contact', {
        method: 'GET',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async editAddress(payload: AddressPutAPIPayload): Promise<void> {
      const authStore = useAuthStore()

      const { error: supabaseError } = await useFetch('/api/user/address', {
        method: 'PUT',
        headers: {
          Authorization: await authStore.getBearerToken,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value
    },

    async addAddress(payload: AddressPostAPIPayload): Promise<AddAddressResponseType> {
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

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
