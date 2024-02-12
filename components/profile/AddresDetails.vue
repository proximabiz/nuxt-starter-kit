<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import { useAddressStore } from '~/stores/address'

interface Props {
  addressDetails: any
}

const notify = useNotification()
const addressStore = useAddressStore()

const isDisabled = ref(false)
const isEditable = ref(false)
const isLoading = ref(true)
const isNewUser = ref(false)

interface FormState {
  name?: string
  orgname?: string
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
// const schema = z.object({
//   country: z.string().min(1, 'Country is required'),
//   zip: z.string().min(1, 'Zip is required'),
//   city: z.string().min(1, 'City is required'),
//   region: z.string().min(1, 'Region is required'),
//   address: z.string().min(1, 'Address is required'),
//   phone: z.string().min(1, 'Phone must be a valid number with at least 10 digits'),
//   message: z.string().min(1, 'Message is required'),
// })

async function getAddress() {
  try {
    const response = await addressStore.fetchAddress()
    isLoading.value = false
    state.name = response.name
    state.orgname = response.organisation_name
    state.country = response.country
    state.zip = response.zip_code
    state.city = response.city
    state.region = response.region
    state.address = response.address
    state.phone = response.phone_number
    state.email = response.email

    if (
      // response.name==""
      // && response.organisation_name==""
      // && response.country==""
      // && response.zip_code==""
      // && response.city==""
      // && response.region==""
      // && response.address==""
      response.phone === ''
    ) {
      // isEditable.value=true
    }
    if (response.name == undefined && response.organisation_name == undefined) {
      isEditable.value = false
      isNewUser.value = true
    }
  }

  catch (error) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await getAddress()
})

async function onSubmit() {
  const payload = {
    country: state.country,
    region: state.region,
    city: state.city,
    zipcode: state.zip,
    address: state.address,
    phoneNumber: state.phone,
  }
  if (isNewUser) {
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
      const response = await addressStore.addAddress(payloadPost)
      console.log(response)
      if (response?.status === 200) {
        notify.success(response.message)
        await getAddress()
        isEditable.value = false
      }
    }
    catch (error) {
      notify.error(error.statusMessage)
    }
  }

  try {
    const response = await addressStore.editAddress(payload)
    if (response?.status === 200) {
      notify.success(response.message)
      await getAddress()
      isEditable.value = false
    }
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}

function toggleEdit() {
  isEditable.value = !isEditable.value
  isDisabled.value = true
}

async function onCancel() {
  await getAddress()
}
</script>

<template>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Fetching your <span class="font-bold"> Address and contact</span> details...
    </UCard>
  </UModal>

  <UBreadcrumb
    divider=">"
    :links="[{ label: 'My Account', to: '/profile/account' }, { label: 'Address and Contact Details' }]"
  />
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold mb-4">
      Address and Contact Details
    </h1>

    <UCard class="mb-8">
      <UForm schema="" :state="state" class="space-y-4 " @submit="onSubmit">
        <div class="flex gap-2">
          <UFormGroup label="Name" name="name" required>
            <UInput v-model="state.name" color="blue" :disabled="!isNewUser" />
          </UFormGroup>
          <UFormGroup label="Organisation Name" name="orgname" required>
            <UInput v-model="state.orgname" color="blue" :disabled="!isNewUser" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Country" name="country" required>
            <UInput v-model="state.country" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
          <UFormGroup label="Zip" name="zip" required>
            <UInput v-model="state.zip" color="blue" :disabled="!isEditable && !isNewUser" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
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
        <UFormGroup label="Phone no" name="phone" required>
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" :disabled="!isEditable && !isNewUser" />
        </UFormGroup>
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
          <UButton v-else type="submit" color="blue">
            Save
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
</template>

<style scoped></style>
