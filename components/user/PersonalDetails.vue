<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import { z } from 'zod'

const notify = useNotification()
const userStore = useUserStore()

interface FormState {
  name: string
  orgname: string
  country: string
  zip: string
  city: string
  region: string
  address: string
  phone: string
  email?: string
}

const initialState: FormState = {
  name: '',
  orgname: '',
  country: '',
  zip: '',
  city: '',
  region: '',
  address: '',
  phone: '',
  email: '',
}

const state = reactive<FormState>({ ...initialState })
// #validation

const nameValidation = z.string().refine((value) => {
  // Check for two words separated by space
  const parts = value.trim().split(/\s+/)
  if (parts.length < 2)
    return false // Ensure there are at least two words

  // Check for minimum length and no special characters or numbers
  return parts.every((part) => {
    return /^[A-Za-z]+$/.test(part) && part.length >= 4
  })
}, {
  message: 'Name must consist of at least two words, each with a minimum of 3 characters, without special characters or numbers.',
})

const schema = z.object({
  name: nameValidation,
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone must be a valid number with at least 10 digits'),
})

async function getAddress() {
  try {
    const response = await userStore.fetchAddress()
    if (!response)
      return

    state.name = response.userDetails[0]?.name
    state.orgname = response.userDetails[0]?.organisation_name
    state.country = response.userAddress[0]?.country
    state.zip = response.userAddress[0]?.zip_code
    state.city = response.userAddress[0]?.city
    state.region = response.userAddress[0]?.region
    state.address = response.userAddress[0]?.address
    state.phone = response.userAddress[0]?.phone_number
    state.email = response.userData?.email
  }
  catch (error) {
    console.error(error)
    notify.error(error.message)
  }
}

onMounted(async () => {
  await getAddress()
})

async function onSubmit() {
  const payloadPost = {
    name: state.name,
    organisationName: state.orgname,
    country: state.country,
    region: state.region,
    city: state.city,
    zipcode: state.zip,
    address: state.address,
    phoneNumber: state.phone,
  }
  try {
    const response = await userStore.addAddress(payloadPost)

    state.country = response.country
    state.zip = response.zip_code
    state.city = response.city
    state.region = response.region
    state.address = response.address
    state.phone = response.phone_number

    notify.success('Address added successfully!')

    navigateTo('/app/diagram/list')
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}
</script>

<template>
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold mb-4">
      Address and Contact Details
    </h1>

    <UCard class="mb-8">
      <UForm :schema="schema" :state="state" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <UFormGroup label="Full Name" name="name" required>
            <UInput v-model="state.name" color="blue" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname" required>
            <UInput v-model="state.orgname" color="blue" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country" required>
            <UInput v-model="state.country" color="blue" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip" required>
            <UInput v-model="state.zip" color="blue" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="City" name="city" required>
            <UInput v-model="state.city" color="blue" />
          </UFormGroup>
          <UFormGroup label="Region" name="region" required>
            <UInput v-model="state.region" color="blue" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address" required>
          <UInput v-model="state.address" color="blue" />
        </UFormGroup>
        <UFormGroup label="Phone no" name="phone" required>
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" />
        </UFormGroup>
        <UFormGroup label="Email Id" name="email" required>
          <UInput v-model="state.email" color="blue" :disabled="true" />
        </UFormGroup>
        <div class="flex gap-2 justify-center">
          <UButton type="submit" color="blue">
            Save
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
</template>

<style scoped></style>
