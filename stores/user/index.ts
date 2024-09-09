import type { AddressPutAPIPayload, GetTaxGSTResponseType, State, TaxPostAPIPayload, UserAddressType } from './types'
import type { Database } from '~/types/supabase'

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
      const getRefreshToken = (await supabaseClient.auth.getSession()).data.session?.refresh_token
      const cookie = `sb-access-token=${accessToken}; sb-refresh-token=${getRefreshToken}`
      const { data: supabaseResponse, error: supabaseError } = await useFetch('/api/user/gst', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookie,
        },
      })

      if (supabaseError.value)
        throw supabaseError.value

      /* @ts-expect-error need to be fixed */
      return supabaseResponse.value?.data[0]
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
      const authStore = useAuthStore()

      const userId = authStore.getAuthUser.value?.id
      const supabaseClient = useSupabaseClient<Database>()

      const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('get_user_address_details', {
        param_user_id: userId as string,
      })

      if (supabaseError)
        throw supabaseError

      return supabaseResponse[0]
    },

    async insertUpdateAddress(payload: AddressPutAPIPayload): Promise<void> {
      const supabaseClient = useSupabaseClient<Database>()
      const authStore = useAuthStore()
      const userId = authStore.getAuthUser.value?.id
      try {
        const { data: supabaseResponse, error: supabaseError } = await supabaseClient.rpc('insert_or_updte_user_address_details', {

          param_country: payload.country,
          param_zip_code: payload.zipcode,
          param_city: payload.city,
          param_region: payload.region,
          param_address: payload.address,
          param_phone_number: payload.phoneNumber,
          param_name: payload.name,
          param_organisation_name: payload.orgname,
          param_user_id: userId as string,

        })
        if (supabaseError)
          throw supabaseError.message

        return supabaseResponse
      }
      catch (supabaseError) {
        throw supabaseError.message
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
