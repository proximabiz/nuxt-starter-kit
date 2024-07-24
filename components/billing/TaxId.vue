<script setup lang="ts">
const { $error } = useNuxtApp()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const isDisabled = ref(false)

onMounted(async () => {
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
})
</script>

<template>
  <div class="flex justify-center items-center flex-col my-8">
    <div class="flex mt-4">
      <span class="px-4">Tax ID : </span>
      <UForm :state="subscriptionStore.billingDetails">
        <UFormGroup name="gst">
          <UInput
            v-model="subscriptionStore.billingDetails.taxId" placeholder="Enter your Tax ID." :disabled="isDisabled" class="custom-input"
            color="blue"
          />
        </UFormGroup>
      </UForm>
    </div>
  </div>
</template>
