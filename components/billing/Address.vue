<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'

interface FormState {
  name: string
  orgname: string
  country: string
  zip: string
  city: string
  region: string
  address: string
  phone: string
}
const initialState= {
    name: '',
    orgname: '',
    country: '',
    zip: '',
    city: '',
    region: '',
    address: '',
    phone: '',
}
const state = reactive({ ...initialState })
const links = [{
  label: 'Your plan',
  to: '/billing/monthly-billing'
}, {
  label: 'Your Address',
  to:"/billing/billing-address"
}, {
  label: 'Card Details',
  to:"/billing/card-details"
}]

</script>

<template>
    <section class="grid place-items-center mb-8">
        <div class="mb-4">
    <UBreadcrumb :links="links" divider="" :ui="{ ol: 'gap-x-3' }">
    <template #icon="{ link, index, isActive }">
      <UAvatar
        :alt="(index + 1 ).toString()"
        :ui="{
          background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
          placeholder: isActive ? 'text-white dark:text-gray-900' : !!link.to ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : ''
        }"
        size="xs"
      />
    </template>
  </UBreadcrumb>
</div>
        <h1 class="font-semibold mb-4">
            Add Billing Address
        </h1>
        <UCard class="mb-8">
            <UForm :state="state" class="space-y-4">
                <div class="flex gap-2">
                    <UFormGroup label="Name" name="name">
                        <UInput v-model="state.name" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Organisation Name" name="orgname">
                        <UInput v-model="state.orgname" color="blue" />
                    </UFormGroup>
                </div>
                <div class="flex gap-2">
                    <UFormGroup label="Country" name="country">
                        <UInput v-model="state.country" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Zip" name="zip">
                        <UInput v-model="state.zip" color="blue" />
                    </UFormGroup>
                </div>
                <div class="flex gap-2">
                    <UFormGroup label="City" name="city">
                        <UInput v-model="state.city" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Region" name="region">
                        <UInput v-model="state.region" color="blue" />
                    </UFormGroup>
                </div>
                <UFormGroup label="Address" name="address">
                    <UInput v-model="state.address" color="blue" />
                </UFormGroup>
                <UFormGroup label="Phone no" name="phone">
                    <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" />
                </UFormGroup>
                <!-- <UFormGroup label="Email Id" name="email">
                    <UInput v-model="state.email" color="blue" />
                </UFormGroup> -->
      </UForm>
    </UCard>
    <NuxtLink to="/billing/card-details">
      <UButton class="mt-4">
        Continue
      </UButton>
    </NuxtLink>
  </section>
</template>

<style scoped></style>
