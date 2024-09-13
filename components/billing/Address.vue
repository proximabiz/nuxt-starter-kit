<script setup lang="ts">
import { z } from 'zod'
import type PhoneInputField from '@/components/lib/VueTelInput/Index.vue'

const subscriptionStore = useSubscriptionStore()
const userStore = useUserStore()

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

const phoneRef = ref<typeof PhoneInputField>()

const billingSchema = z.object({
  name: nameValidation,
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().refine(() => {
    return phoneRef.value?.handlePhoneValidation().status
  }),
})

onMounted(async () => {
  const response = await userStore.fetchAddress()
  if (!response)
    return

  subscriptionStore.billingDetails.name = response?.name
  subscriptionStore.billingDetails.orgName = response?.organisation_name
  subscriptionStore.billingDetails.country = response?.country
  subscriptionStore.billingDetails.zip = response?.zip_code
  subscriptionStore.billingDetails.city = response?.city
  subscriptionStore.billingDetails.region = response?.region
  subscriptionStore.billingDetails.address = response?.address
  subscriptionStore.billingDetails.phone = response?.phone_number
})
</script>

<template>
  <UCard class="mb-6 mt-4">
    <UForm :schema="billingSchema" :state="subscriptionStore.billingDetails" class="space-y-2">
      <div class="flex gap-2">
        <UFormGroup label="Full Name" name="name" required>
          <UInput v-model="subscriptionStore.billingDetails.name" color="blue" />
        </UFormGroup>
        <UFormGroup label="Organisation Name" name="orgname">
          <UInput v-model="subscriptionStore.billingDetails.orgName" color="blue" />
        </UFormGroup>
      </div>
      <div class="flex gap-2">
        <UFormGroup label="Country" name="country" required>
          <UInput v-model="subscriptionStore.billingDetails.country" color="blue" />
        </UFormGroup>
        <UFormGroup label="Zip" name="zip" required>
          <UInput v-model="subscriptionStore.billingDetails.zip" color="blue" />
        </UFormGroup>
      </div>
      <div class="flex gap-2">
        <UFormGroup label="City" name="city" required>
          <UInput v-model="subscriptionStore.billingDetails.city" color="blue" />
        </UFormGroup>
        <UFormGroup label="Region" name="region" required>
          <UInput v-model="subscriptionStore.billingDetails.region" color="blue" />
        </UFormGroup>
      </div>
      <UFormGroup label="Address" name="address" required>
        <UInput v-model="subscriptionStore.billingDetails.address" color="blue" />
      </UFormGroup>
      <LibVueTelInput
        ref="phoneRef"
        :prop-phone="subscriptionStore.billingDetails.phone"
        class="my-4"
      />
    </UForm>
  </UCard>
</template>
