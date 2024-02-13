<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import { z } from 'zod'
import { useBillingStore } from '~/stores/subscription'

const state = useBillingStore()

const billingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  orgName: z.string().min(1, 'Organisation Name is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip is required').regex(/^\d+$/, 'Zip must be number'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
})
</script>

<template>
  <UCard class="mb-6 mt-4">
    <UForm :schema="billingSchema" :state="state" class="space-y-2">
      <div class="flex gap-2">
        <UFormGroup label="Name" name="name" required>
          <UInput v-model="state.name" color="blue" />
        </UFormGroup>
        <UFormGroup label="Organisation Name" name="orgname" required>
          <UInput v-model="state.orgName" color="blue" />
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
    </UForm>
  </UCard>
</template>
