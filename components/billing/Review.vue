<script setup lang="ts">
interface Props {
  planName: string
  duePrice: string
}
const props = defineProps<Props>()
const subscriptionStore = useSubscriptionStore()
const allDetails = computed(() => subscriptionStore.billingDetails)
const { $success } = useNuxtApp()
const router = useRouter()
const isSavePopupOpen = ref(false)

function completeOrder() {
  isSavePopupOpen.value = true
  // const payload = {
  //   country: allDetails.value.country,
  //   region: allDetails.value.region,
  //   city: allDetails.value.city,
  //   zipcode: allDetails.value.zip,
  //   address: allDetails.value.address,
  //   phoneNumber: allDetails.value.phone,
  //   subscriptionTypeId: '10dbc647-04ea-4588-b6c8-7c535049f18c',
  //   planType: allDetails.value,
  //   currencyCode: allDetails.value,
  //   cardHolderName: allDetails.value.cardHolderName,
  //   cardNumber: allDetails.value.cardNo,
  //   expiryDate: allDetails.value.expDate,
  //   securityCode: allDetails.value.cvv,
  // }
}
function navigateTo(path: string) {
  router.push(path)
}
function saveDetails(valid: boolean) {
  isSavePopupOpen.value = false
  if (valid)
    $success('Plan upgraded successfully.')
  // eslint-disable-next-line no-lone-blocks
  { setTimeout(() => {
    navigateTo('/app/diagram/list')
  }, 2000) }
}
</script>

<template>
  <section class="grid place-items-center mt-6 gap-3">
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Plan Details:
      </div>
      <div>
        <p class="font-medium text-xl">
          AI FlowMapper {{ props.planName }}
        </p>
        <p class="font-bold text-3xl">
          {{ props.duePrice }}
        </p>
        <p>Billed annually. 18% tax included</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Address Details:
      </div>
      <div>
        <p>{{ allDetails.name }}</p>
        <p>{{ allDetails.city }} {{ allDetails.zip }}</p>
        <p>{{ allDetails.country }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Card Details:
      </div>
      <div>
        <p>Name on the card: {{ allDetails.cardHolderName }}</p>
        <p>Credit or debit card number: {{ allDetails.cardNo }}</p>
        <p>Expire date: {{ allDetails.expDate }}</p>
        <p>Security code: {{ allDetails.cvv }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Tax ID:
      </div>
      <div>
        <p>{{ allDetails.taxId }}</p>
      </div>
    </div>
    <!-- <div class="font-bold">
      Enter payment details
    </div> -->
    <!-- <USelectMenu v-model="selected" :options="people">
      <template #leading>
        <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4 mx-0.5" />
        <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" size="3xs" class="mx-0.5" />
      </template>
    </USelectMenu> -->
    <UButton class="mt-4" @click="completeOrder">
      Complete order
    </UButton>
  </section>
  <Confirmation
    v-model="isSavePopupOpen"
    :is-open="isSavePopupOpen"
    text="Are you sure you want to submit details?"
    left-button="Cancel"
    right-button="Ok"
    @update:is-open="isSavePopupOpen = $event"
    @delete-confirm="saveDetails(true)"
  />
</template>

<style scoped>
.min-width {
  min-width: 30rem;
  max-width: 30rem;
}
</style>
