<script setup lang="ts">
interface Props {
  planName: string
  duePrice: string
}
const props = defineProps<Props>()
const isLoading = ref<boolean>(false)
const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()
const billingStore = useBillingDetailsStore()

const authUser = computed(() => authStore.getAuthUser.value)
const allDetails = computed(() => subscriptionStore.billingDetails)
const sub_status = computed(() => subscriptionStore.subscriptionStatus)
const planDetails = computed(() => billingStore.propObject)

const { $success, $error } = useNuxtApp()
const router = useRouter()
const saveModal = ref(false)

function completeOrder() {
  saveModal.value = true
}
function navigateTo(path: string) {
  router.push(path)
}
const expirationDate = allDetails.value.expDate && allDetails.value.expDate.split('/')
async function handleCompleteOrder(valid: boolean) {
  saveModal.value = false
  try {
    isLoading.value = true
    const payload = {
      firstName: allDetails.value.name.split(' ')[0],
      lastName: allDetails.value.name.split(' ')[1],
      email: authUser.value?.email,
      country: allDetails.value.country,
      region: allDetails.value.region,
      city: allDetails.value.city,
      zipcode: allDetails.value.zip,
      address: allDetails.value.address,
      phoneNumber: allDetails.value.phone,
      amount: sub_status.value.amount,
      // amount: Number.parseInt(props.duePrice),
      subscriptionTypeId: planDetails.value.id,
      planType: planDetails.value.planType,
      currencyCode: planDetails.value.currencyCode,
      cardHolderName: allDetails.value.cardHolderName,
      cardNumber: allDetails.value.cardNo,
      expiryMonth: Number(expirationDate[0]),
      expiryYear: Number(expirationDate[1]),
      securityCode: allDetails.value.cvv !== '****' ? allDetails.value.cvv.toString() : '',
    }
    const gst = { gstNumber: allDetails.value?.taxId ? allDetails.value?.taxId : '' }
    const finalPayload = allDetails.value?.taxId ? { ...payload, ...gst } : payload
    const response = await subscriptionStore.completeOrder(finalPayload)
    if (valid && response) {
      isLoading.value = false
      $success('Plan upgraded successfully.')
      navigateTo('/app/diagram/list')
    }
  }
  catch (error) {
    isLoading.value = false
    $error(error.data.message)
  }
}
</script>

<template>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Upgrading your new plan...
    </UCard>
  </UModal>
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

    <UButton class="mt-4" @click="completeOrder">
      Complete order
    </UButton>
  </section>
  <Confirmation
    v-model="saveModal"
    :is-open="saveModal"
    text="Are you sure you want to submit details?"
    left-button="Cancel"
    right-button="Ok"
    @update:is-open="saveModal = $event"
    @delete-confirm="handleCompleteOrder(true)"
  />
</template>

<style scoped>
.min-width {
  min-width: 30rem;
  max-width: 30rem;
}
</style>
