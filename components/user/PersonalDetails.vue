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

const formstate = reactive<FormState>({ ...initialState })
// #validation

const nameValidation = z.string().min(1, 'Full name is required').refine((value) => {
  if (value.trim() === '')
    return true

  // Check for two words separated by space
  const parts = value.trim().split(/\s+/)
  if (parts.length < 2)
    return false // Ensure there are at least two words

  // Check for minimum length and no special characters or numbers
  return parts.every((part) => {
    return /^[A-Za-z]+$/.test(part) && part.length >= 3
  })
}, {
  message: 'Enter a valid name of 3 letters and without numbers and symbols',
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

    formstate.name = response.userDetails[0]?.name
    formstate.orgname = response.userDetails[0]?.organisation_name
    formstate.country = response.userAddress[0]?.country
    formstate.zip = response.userAddress[0]?.zip_code
    formstate.city = response.userAddress[0]?.city
    formstate.region = response.userAddress[0]?.region
    formstate.address = response.userAddress[0]?.address
    formstate.phone = response.userAddress[0]?.phone_number
    formstate.email = response.userData?.email
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
    name: formstate.name,
    organisationName: formstate.orgname,
    country: formstate.country,
    region: formstate.region,
    city: formstate.city,
    zipcode: formstate.zip,
    address: formstate.address,
    phoneNumber: formstate.phone,
  }
  try {
    const response = await userStore.addAddress(payloadPost)

    formstate.country = response.country
    formstate.zip = response.zip_code
    formstate.city = response.city
    formstate.region = response.region
    formstate.address = response.address
    formstate.phone = response.phone_number

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
      <UForm :state="formstate" :schema="schema" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <UFormGroup label="Full Name" name="name" class="w-1/2" required>
            <UInput v-model="formstate.name" color="blue" placeholder="First Name Last Name" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname">
            <UInput v-model="formstate.orgname" color="blue" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country" required>
            <UInput v-model="formstate.country" color="blue" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip" required>
            <UInput v-model="formstate.zip" color="blue" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="City" name="city" required>
            <UInput v-model="formstate.city" color="blue" />
          </UFormGroup>
          <UFormGroup label="Region" name="region" required>
            <UInput v-model="formstate.region" color="blue" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address" required>
          <UInput v-model="formstate.address" color="blue" />
        </UFormGroup>
        <UFormGroup label="Phone No" name="phone" required>
          <VueTelInput v-model="formstate.phone" placeholder="Your Phone no" mode="international" />
        </UFormGroup>
        <UFormGroup label="Email Id" name="email" required>
          <UInput v-model="formstate.email" color="blue" :disabled="true" />
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
