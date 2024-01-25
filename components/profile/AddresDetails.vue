<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import type { FormSubmitEvent } from '#ui/types'
import { useAddressStore } from '~/stores'

const notify = useNotification()
const addressStore = useAddressStore()
const isDisabled=ref(true)

interface FormState {
  name: string;
  orgname: string;
  country: string;
  zip: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  email: string;
  isEditable: boolean;
}
const initialState:FormState = {
  name: 'Ipsita',
  orgname: 'Proxima',
  country: 'India',
  zip: '76534',
  city: 'Bangalore',
  region: 'Karnataka',
  address: 'test',
  phone: '9875547899',
  email: 'ipsitap@proximabiz.com',
  isEditable: false,
}

const state = reactive<FormState>({ ...initialState })


async function getAddress() {
  try {
  const addressData=  await addressStore.fetchAddress()
  // console.log(addressData)
  return addressData
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}

onMounted(async () => {
  console.log("i am calling")
  await getAddress();
});

 const onSubmit=async(event: FormSubmitEvent<any>)=> {
  // Do something with data
  // console.log(event.data)
}

const toggleEdit=() =>{
  state.isEditable = !state.isEditable
  isDisabled.value=true
}

const onCancel=() =>{
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
      <UForm :state="state" class="space-y-4 " @submit="onSubmit">
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
            <UInput v-model="state.country" color="blue" :disabled="!state.isEditable"/>
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
          <UButton v-else type="submit" color="blue"  :disabled="isDisabled">
            Save
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
</template>

<style scoped></style>
