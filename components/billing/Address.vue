<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import { z } from 'zod'
import { useBillingStore } from '~/stores/subscription'

const state = useBillingStore()
const addressStore = useAddressStore()

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
  message: 'Enter a valid full name',
})

const billingSchema = z.object({
  name: nameValidation,
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone must be a valid number with at least 10 digits'),
})

onMounted(async () => {
  const response = await addressStore.fetchAddress()
  state.billingDetails.name = response.name
  state.billingDetails.orgName = response.organisation_name
  state.billingDetails.country = response.country
  state.billingDetails.zip = response.zip_code
  state.billingDetails.city = response.city
  state.billingDetails.region = response.region
  state.billingDetails.address = response.address
  state.billingDetails.phone = response.phone_number
})
</script>

<template>
  <UCard class="mb-6 mt-4">
    <UForm :schema="billingSchema" :state="state.billingDetails" class="space-y-2">
      <div class="flex gap-2">
        <UFormGroup label="Full Name" name="name" required>
          <UInput v-model="state.billingDetails.name" color="blue" />
        </UFormGroup>
        <UFormGroup label="Organisation Name" name="orgname" required>
          <UInput v-model="state.billingDetails.orgName" color="blue" />
        </UFormGroup>
      </div>
      <div class="flex gap-2">
        <UFormGroup label="Country" name="country" required>
          <UInput v-model="state.billingDetails.country" color="blue" />
        </UFormGroup>
        <UFormGroup label="Zip" name="zip" required>
          <UInput v-model="state.billingDetails.zip" color="blue" />
        </UFormGroup>
      </div>
      <div class="flex gap-2">
        <UFormGroup label="City" name="city" required>
          <UInput v-model="state.billingDetails.city" color="blue" />
        </UFormGroup>
        <UFormGroup label="Region" name="region" required>
          <UInput v-model="state.billingDetails.region" color="blue" />
        </UFormGroup>
      </div>
      <UFormGroup label="Address" name="address" required>
        <UInput v-model="state.billingDetails.address" color="blue" />
      </UFormGroup>
      <UFormGroup label="Phone no" name="phone" required>
        <VueTelInput v-model="state.billingDetails.phone" placeholder="Your Phone no" mode="international" />
      </UFormGroup>
    </UForm>
  </UCard>
</template>
