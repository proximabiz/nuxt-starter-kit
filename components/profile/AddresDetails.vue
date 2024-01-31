<script setup lang="ts">
import { z } from 'zod'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import type { FormSubmitEvent } from '#ui/types'

interface Props {
  addressDetails: any
}
const props = defineProps<Props>()

const isDisabled = ref(true)


// addressDetails.value=props.addressDetails

// interface FormState {
//   name: string
//   orgname: string
//   country: string
//   zip: string
//   city: string
//   region: string
//   address: string
//   phone: string
//   email: string
//   isEditable: boolean
// }
// const initialState: FormState = {
//   name: 'Ipsita',
//   orgname: 'Proxima',
//   country: "",
//   zip: '76534',
//   city: 'Bangalore',
//   region: 'Karnataka',
//   address: 'test',
//   phone: '9875547899',
//   email: 'ipsitap@proximabiz.com',
//   isEditable: false,
// }

// const state = reactive<FormState>({ ...initialState })
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


async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
}

// function toggleEdit() {
//   state.isEditable = !state.isEditable
//   isDisabled.value = true
// }

// function onCancel() {
//   Object.assign(state, initialState)
// }
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
  address printing {{ addressDetails }}
    <UCard class="mb-8">
      <UForm :schema="schema" :state="props.addressDetails" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <!-- <UFormGroup label="Name" name="name">
            <UInput v-model="state.name" color="blue" :disabled="true" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname">
            <UInput v-model="state.orgname" color="blue" :disabled="true" />
          </UFormGroup> -->
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country">
            <UInput v-model="props.addressDetails?.country" color="blue" :disabled="!addressDetails.isEditable" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip">
            <UInput v-model="props.addressDetails?.zip" color="blue" :disabled="!addressDetails.isEditable" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="City" name="city">
            <UInput v-model="props.addressDetails?.city" color="blue" :disabled="!addressDetails.isEditable" />
          </UFormGroup>
          <UFormGroup label="Region" name="region">
            <UInput v-model="addressDetails?.region" color="blue" :disabled="!addressDetails.isEditable" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address" name="address">
          <UInput v-model="props.addressDetails?.address" color="blue" :disabled="!addressDetails.isEditable" />
        </UFormGroup>
        <!-- <UFormGroup label="Phone no" name="phone">
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" :disabled="!addressDetails.isEditable" />
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
        </div> -->
      </UForm>
    </UCard>
  </section>
</template>

<style scoped></style>
