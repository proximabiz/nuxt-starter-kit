<script setup lang="ts">
import { useGstTaxStore } from '~/stores/gst';

interface State {
  gstNumber: string
}
interface ResponseType {
  status: number;
  message: string; 
}
const notify = useNotification()
const taxGstStore = useGstTaxStore()
const state = reactive<State>({
  gstNumber: '',
})
const isModalVisible = ref(false)
const isDisabled=ref(false)

const  getTaxGst=async() =>{
  try {
    const response= await taxGstStore.fetchTaxGst(); 
    state.gstNumber=response?.gst_number 
    isDisabled.value = true
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}

onMounted(async () => {
  await getTaxGst()
});

function showModal() {
  isModalVisible.value = true
}

const onSubmit=async(): Promise<void>=> {

  try {
    const response = await taxGstStore.addTaxGst(state)
    if (response?.status==200) {    
      isDisabled.value = true
      isModalVisible.value = false   
      notify.success(response.message)
    }
  } 
  catch (error) {
    notify.error(error.statusMessage)
  } 
}
 const handleDeleteConfirm= async (): Promise<void> => {
  try {
    const response = await taxGstStore.deleteTaxGst()
    if (response?.status==200) {
      // Clear the GST number from state
      state.gstNumber = ''
      isDisabled.value = false
      isModalVisible.value = false   
      notify.success(response.message)
    }
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}
</script>

<template>
  <UBreadcrumb
    divider=">"
    :links="[{ label: 'My Account', to: '/profile/account' }, { label: 'GST And TAX details' }]"
  />
  <div class="flex justify-center items-center flex-col py-8">
    <h1 class="font-semibold">
      Tax ID and GST Details
    </h1>
    <div class="flex mt-4">
      <span class="px-4">Tax ID / GST Number : </span>
      <UForm :state="state" class="" @submit="onSubmit">
        <UFormGroup name="gst">
          <UInput
            v-model="state.gstNumber" placeholder="Enter your Tax ID/GST No." :disabled="isDisabled" class="custom-input"
            color="blue"
          />
        </UFormGroup>
        <div class="flex gap-6 mt-8">
          <UButton v-if="!isDisabled" type="submit" class="w-fit" color="blue">
            Cancel
          </UButton>
          <UButton v-if="!isDisabled" type="submit" class="w-fit" color="blue">
            Save
          </UButton>
        </div>
      </UForm>
      <Icon v-if="isDisabled" name="material-symbols-light:delete-rounded" color="black" class="text-2xl mt-1 cursor-pointer" @click="showModal" />
      <Confirmation v-model="isModalVisible" :is-open="isModalVisible" @update:is-open="isModalVisible = $event" @delete-confirm="handleDeleteConfirm" />
    </div>
  </div>
</template>
