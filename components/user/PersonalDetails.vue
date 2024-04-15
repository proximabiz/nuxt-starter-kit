<script setup lang="ts">
import { z } from 'zod'
import type PhoneInputField from '@/components/lib/VueTelInput/Index.vue'

const { $success, $error } = useNuxtApp()
const userStore = useUserStore()
const authStore = useAuthStore()

const authUser = computed(() => authStore.getAuthUser.value)

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
  email: authUser.value?.email,
}

const formState = reactive<FormState>({ ...initialState })
const phoneRef = ref<typeof PhoneInputField>()

// #validation

// Utility function to enforce non-empty, non-space-only strings
function nonEmptyString(field: string) {
  return z.string()
    .min(1, `${field} is required`)
    .refine(value => value.trim().length > 0, `${field} can't be empty or spaces only`)
}

const nameValidation = nonEmptyString('Full name').refine((value) => {
  const parts = value.trim().split(/\s+/)
  if (parts.length < 2)
    return false // Ensure there are at least two words

  // Check for minimum length and no special characters or numbers
  return parts.every(part => /^[A-Za-z]+$/.test(part) && part.length >= 3)
}, {
  message: 'Enter a valid name of 3 letters and without numbers and symbols',
})

const schema = z.object({
  name: nameValidation,
  country: nonEmptyString('Country'),
  zip: nonEmptyString('Zip code'),
  city: nonEmptyString('City'),
  region: nonEmptyString('Region'),
  address: nonEmptyString('Address'),
})

async function getAddress() {
  try {
    const response = await userStore.fetchAddress()
    if (!response)
      return

    formState.name = response?.name
    formState.orgname = response?.organisation_name
    formState.country = response?.country
    formState.zip = response?.zip_code
    formState.city = response?.city
    formState.region = response?.region
    formState.address = response?.address
    formState.phone = response?.phone_number
    formState.email = authUser.value?.email
  }
  catch (error) {
    $error(error.message)
  }
}

onMounted(async () => {
  await getAddress()
})

async function onSubmit() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return

  const payload = {
    name: formState.name,
    orgname: formState.orgname,
    country: formState.country,
    region: formState.region,
    city: formState.city,
    zipcode: formState.zip,
    address: formState.address,
    phoneNumber: phoneRef.value?.phoneData.number,
  }

  try {
    await userStore.insertUpdateAddress(payload)

    $success('Address added successfully!')

    navigateTo('/app/diagram/list')
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

function handlePhoneValidation() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return false
}
</script>

<template>
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold mb-4">
      Address and Contact Details
    </h1>

    <UCard class="mb-8">
      <UForm :state="formState" :schema="schema" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <UFormGroup label="Full Name" name="name" class="w-1/2" required>
            <UInput v-model="formState.name" color="blue" placeholder="First Name Last Name" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname">
            <UInput v-model="formState.orgname" color="blue" placeholder="Organisation Name" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country" required>
            <UInput v-model="formState.country" color="blue" placeholder="Country" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip" required>
            <UInput v-model="formState.zip" color="blue" placeholder="Zip" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="City" name="city" required>
            <UInput v-model="formState.city" color="blue" placeholder="City" />
          </UFormGroup>
          <UFormGroup label="Region" name="region" required>
            <UInput v-model="formState.region" color="blue" placeholder="Region" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address" required>
          <UInput v-model="formState.address" color="blue" placeholder="Address" />
        </UFormGroup>
        <LibVueTelInput
          ref="phoneRef"
          :prop-phone="formState.phone"
          class="my-4"
        />
        <UFormGroup label="Email Id" name="email" required>
          <UInput v-model="formState.email" color="blue" :disabled="true" />
        </UFormGroup>
        <div class="flex gap-2 justify-center">
          <UButton type="submit" color="blue" @click="handlePhoneValidation()">
            Save
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
</template>
