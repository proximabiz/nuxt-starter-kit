<script setup lang="ts">
const { $error } = useNuxtApp()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const isDisabled = ref<boolean>(false)

async function fetchGstTax() {
  try {
    const response = await userStore.fetchTaxGst()

    if (response) {
      subscriptionStore.billingDetails.taxId = response.gst_number
      if (response.gst_number)
        isDisabled.value = true
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

onMounted(async () => {
  await fetchGstTax()
})
</script>

<template>
  <div class="flex justify-center items-center flex-col my-8">
    <div class="flex mt-4">
      <span class="px-4">Tax ID / GST Number: </span>
      <UForm :state="subscriptionStore.billingDetails">
        <UFormGroup name="gst">
          <UInput
            v-model="subscriptionStore.billingDetails.taxId" placeholder="Enter your Tax ID / GST Number." :disabled="isDisabled" class="custom-input"
            color="blue"
          />
        </UFormGroup>
      </UForm>
    </div>
  </div>
</template>
