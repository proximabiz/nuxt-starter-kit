<script setup lang="ts">
import { z } from 'zod'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import type { FormSubmitEvent } from '#ui/types'

interface Props {
  addressDetails: any
}

const notify = useNotification()
const addressStore = useAddressStore()


const isDisabled = ref(true)

interface FormState {
  name: string
  orgname: string
  country: string
  zip: string
  city: string
  region: string
  address: string
  phone: string
  email: string
  isEditable: boolean
}
const initialState: FormState = {
  name: '',
  orgname: '',
  country: "",
  zip: '',
  city: '',
  region: '',
  address: '',
  phone: '',
  email: '',
  isEditable: false,
}
const state = reactive<FormState>({ ...initialState })
// #validation
const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.number().max(10, 'Phone must be a valid number with at least 10 digits'),
  message: z.string().min(1, 'Message is required'),
})

const  getAddress=async() =>{
  try {
    const response= await addressStore.fetchAddress(); 
    state.name=response.name
    state.orgname=response.organisation_name
    state.country=response.country
    state.zip=response.zip_code
    state.city=response.city
    state.region=response.region
    state.address=response.address
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}


onMounted(async () => {
  await getAddress()
});

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
}

function toggleEdit() {
  state.isEditable = !state.isEditable
  isDisabled.value = true
}

function onCancel() {
  Object.assign(state, initialState)
}
</script>

<template>
  <UBreadcrumb
    divider=">"
    :links="[{ label: 'My Account', to: '/profile/account' }, { label: 'Address and Contact Details' }]"
  />
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold mb-4">
      Address and Contact Details
    </h1>
 
    <UCard class="mb-8">
      <UForm :schema="schema" :state="state" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <UFormGroup label="Name" name="name">
            <UInput v-model="state.name" color="blue" :disabled="true" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname">
            <UInput v-model="state.orgname" color="blue" :disabled="true" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country">
            <UInput v-model="state.country" color="blue" :disabled="!state.isEditable" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip">
            <UInput v-model="state.zip" color="blue" :disabled="!state.isEditable" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="City" name="city">
            <UInput v-model="state.city" color="blue" :disabled="!state.isEditable" />
          </UFormGroup>
          <UFormGroup label="Region" name="region">
            <UInput v-model="state.region" color="blue" :disabled="!state.isEditable" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address">
          <UInput v-model="state.address" color="blue" :disabled="!state.isEditable" />
        </UFormGroup>
         <UFormGroup label="Phone no" name="phone">
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" :disabled="!state.isEditable" />
        </UFormGroup>
        <UFormGroup label="Email Id" name="email">
          <UInput v-model="state.email" color="blue" :disabled="true" />
        </UFormGroup>
        <div class="flex gap-2 justify-center">
          <UButton type="submit" color="blue" @click="onCancel">
            Cancel
          </UButton>
          <UButton v-if="!state.isEditable" color="blue" @click="toggleEdit">
            Edit
          </UButton>
          <UButton v-else type="submit" color="blue">
            Save
          </UButton>
        </div> 
      </UForm>
    </UCard>
  </section>
</template>

<style scoped></style>
