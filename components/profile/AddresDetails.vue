<script setup lang="ts">
import { z } from 'zod'
import type PhoneInputField from '@/components/lib/VueTelInput/Index.vue'

const { $success, $error } = useNuxtApp()
const userStore = useUserStore()
const authStore = useAuthStore()
const isDisabled = ref(false)
const isEditable = ref(false)
const isLoading = ref(true)
const isNewUser = ref(false)
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
const state = reactive<FormState>({ ...initialState })
const phoneRef = ref<typeof PhoneInputField>()

// #validation

function nonEmptyString(field: string) {
  return z.string()
    .min(1, `${field} is required`)
    .refine(value => value.trim().length > 0, `${field} can't be empty or spaces only`)
    .refine(value => !value.startsWith(' '), `${field} can't start with a space`)
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

    state.name = response?.name
    state.orgname = response?.organisation_name
    state.country = response?.country
    state.zip = response?.zip_code
    state.city = response?.city
    state.region = response?.region
    state.address = response?.address
    state.phone = response?.phone_number
    state.email = authUser.value?.email

    if (!response?.name && !response?.organisation_name) {
      isEditable.value = false
      isNewUser.value = true
    }
  }
  catch (error) {
    $error(error.message)
  }
  finally {
    isLoading.value = false
  }
}

async function onSubmit() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return

  if (!isNewUser.value) {
    const payload = {
      name: state.name,
      orgname: state.orgname,
      country: state.country,
      region: state.region,
      city: state.city,
      zipcode: state.zip,
      address: state.address,
      phoneNumber: phoneRef.value?.phoneData.number,
    }
    try {
      await userStore.insertUpdateAddress(payload)

      $success('Address edited successfully')

      isEditable.value = false
    }
    catch (error) {
      $error(error.statusMessage)
    }
  }
}

function toggleEdit() {
  isEditable.value = !isEditable.value
  isDisabled.value = true
}

async function onCancel() {
  await getAddress()
}

function handlePhoneValidation() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return false
}

onMounted(() => {
  getAddress()
})
</script>

<template>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Fetching your <span class="font-bold"> Address and contact</span> details...
    </UCard>
  </UModal>
  <ProfileBreadCrumb breadcrumb-text="Address, Contact Details" />

  <section class="grid place-items-center my-8">
    <h1 class="font-semibold mb-4">
      Address and Contact Details
    </h1>

    <UCard class="mb-8">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <UFormGroup label="Full Name" name="name" required>
            <UInput v-model="state.name" color="blue" :disabled="!isNewUser" placeholder="First Name Last Name" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname">
            <UInput v-model="state.orgname" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <UFormGroup label="Country" name="country" required>
            <UInput v-model="state.country" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip" required>
            <UInput v-model="state.zip" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <UFormGroup label="City" name="city" required>
            <UInput v-model="state.city" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
          <UFormGroup label="Region" name="region" required>
            <UInput v-model="state.region" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address" required>
          <UInput v-model="state.address" color="blue" :disabled="!isEditable && !isNewUser" />
        </UFormGroup>
        <LibVueTelInput
          ref="phoneRef"
          :prop-phone="state.phone"
          :disabled="!isEditable && !isNewUser"
          class="my-4"
        />
        <UFormGroup label="Email Id" name="email" required>
          <UInput v-model="state.email" color="blue" :disabled="true" />
        </UFormGroup>
        <div class="flex gap-2 justify-center">
          <UButton color="blue" @click="onCancel">
            Cancel
          </UButton>
          <UButton v-if="!isEditable && !isNewUser" color="blue" @click="toggleEdit">
            Edit
          </UButton>
          <UButton v-else-if="!isNewUser" type="submit" color="blue">
            Update
          </UButton>
          <UButton v-else type="submit" color="blue" @click="handlePhoneValidation()">
            Save
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
</template>
