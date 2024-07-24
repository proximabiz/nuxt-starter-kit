<script setup lang="ts">
interface State {
  gstNumber: string
}
// interface ResponseType {
//   status: number
//   message: string
// }
const { $success, $error } = useNuxtApp()
const userStore = useUserStore()
const state = reactive<State>({
  gstNumber: '',
})
const isModalVisible = ref(false)
const isDisabled = ref(false)
const isLoading = ref(true)

async function getTaxGst() {
  try {
    const response = await userStore.fetchTaxGst()

    if (response) {
      state.gstNumber = response.gst_number
      isLoading.value = false
      if (response.gst_number)
        isDisabled.value = true
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

onMounted(async () => {
  await getTaxGst()
})

function showModal() {
  isModalVisible.value = true
}

async function onSubmit(): Promise<void> {
  try {
    const response = await userStore.addTaxGst(state)
    if (response?.status === 200) {
      isDisabled.value = true
      isModalVisible.value = false
      $success(response.message)
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}
async function handleDeleteConfirm(): Promise<void> {
  try {
    const response = await userStore.deleteTaxGst()
    if (response?.status === 200) {
      // Clear the GST number from state
      state.gstNumber = ''
      isDisabled.value = false
      isModalVisible.value = false
      $success(response.message)
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}
function cancelGst() {
  state.gstNumber = ''
}
</script>

<template>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Fetching your <span class="font-bold">GST No / TAX Id.</span>
    </UCard>
  </UModal>

  <div class="flex justify-center items-center flex-col my-8">
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
          <UButton v-if="!isDisabled" class="w-fit" color="blue" @click="cancelGst">
            Cancel
          </UButton>
          <UButton v-if="!isDisabled" type="submit" class="w-fit" color="blue">
            Save
          </UButton>
        </div>
      </UForm>
      <Icon v-if="isDisabled" name="material-symbols-light:delete-rounded" color="black" class="text-2xl mt-1 cursor-pointer" @click="showModal" />
      <Confirmation
        v-model="isModalVisible"
        :is-open="isModalVisible"
        text="Are you sure you want to delete this Tax ID/GST No?"
        @update:is-open="isModalVisible = $event"
        @delete-confirm="handleDeleteConfirm"
      />
    </div>
  </div>
</template>
