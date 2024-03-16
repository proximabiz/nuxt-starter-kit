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
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async addTaxGst(payload: TaxPostAPIPayload) {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async deleteTaxGst() {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      return supabaseResponse.value
    },

    async fetchAddress(): Promise<UserAddressType> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address-contact', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data
    },

    async editAddress(payload: AddressPutAPIPayload): Promise<void> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { error: supabaseError } = await useFetch('/api/user/address', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      })

      if (supabaseError.value)
        throw supabaseError.value
    },

    async addAddress(payload: AddressPostAPIPayload): Promise<AddAddressResponseType> {
      const supabaseClient = useSupabaseClient()
      const accessToken = (await supabaseClient.auth.getSession()).data.session?.access_token

      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/address-contact', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
