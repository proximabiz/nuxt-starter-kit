<script setup lang="ts">
const users = ['1user']
const user = ref(users[0])
const isFieldEmtpy = ref<boolean>(true)
const billingCardDetailsRef = ref<any>(null)
const billingCardDetailsValid = ref<boolean>(false)
const saveModal = ref<boolean>(false)
const { $success, $error } = useNuxtApp()

const isLoading = ref<boolean>(false)
const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()

const authUser = computed(() => authStore.getAuthUser.value)
const allDetails = computed(() => subscriptionStore.billingDetails)
const sub_status = computed(() => subscriptionStore.subscriptionStatus)
const selectedPlan = computed(() => subscriptionStore.selectedPlan)
const billingAddressCard = computed(() => subscriptionStore.billingDetails)
const duePrice = computed(() => selectedPlan.value.currencySymbol + selectedPlan.value.calculatedPrice)

function completeOrder() {
  saveModal.value = true
}
const expirationDate = allDetails?.value?.expDate && allDetails?.value?.expDate.split('/')

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
      amount: !sub_status.value.amount ? sub_status.value.amount : 0,
      subscriptionTypeId: selectedPlan.value.id,
      planType: selectedPlan.value.planType,
      currencyCode: selectedPlan.value.currencyCode,
      cardHolderName: allDetails.value.cardHolderName,
      cardNumber: allDetails.value.cardNo,
      expiryMonth: Number(expirationDate[0]),
      expiryYear: Number(expirationDate[1]),
      securityCode: !allDetails.value.cvv ? allDetails.value.cvv.toString() : '000',
    }
    const gst = { gstNumber: allDetails.value?.taxId ? allDetails.value?.taxId : '' }
    const finalPayload = allDetails.value?.taxId ? { ...payload, ...gst } : payload
    const response = await subscriptionStore.completeOrder(finalPayload)
    if (valid && response) {
      $success('Plan upgraded successfully.')
      navigateTo('/app/diagram/list')
    }
  }
  catch (error) {
    $error(error.data.message)
    if (error?.data?.message && error?.data?.message.toLowerCase().includes('empty'))
      setActiveStep(2)
  }
  finally {
    isLoading.value = false
  }
}

const steps = [
  { label: 'Your plan', component: 'BillingDetailsBillling' },
  { label: 'Your Address', component: 'BillingAddress' },
  { label: 'Card Details', component: 'BillingPaymentCardDetails' },
  { label: 'Tax ID', component: 'TaxId' },
  { label: 'Review your details', component: 'BillingReview' },
]

const state = reactive({
  activeStep: 0,
})

watch([billingAddressCard.value, isFieldEmtpy.value], () => {
  const { cardHolderName, cardNo, expDate, cvv } = billingAddressCard.value
  cardHolderName && cardNo && expDate && cvv ? isFieldEmtpy.value = false : isFieldEmtpy.value = true
}, { deep: true, immediate: true })

// Define function to handle the validation result from the child
function handleCardValidation(isValid: boolean) {
  billingCardDetailsValid.value = isValid
}

async function setActiveStep(index: number) {
  const { name, orgName, country, zip, city, region, address, phone, cardHolderName, cardNo, expDate, cvv } = billingAddressCard.value
  isFieldEmtpy.value = true
  try {
    if (index === 2) {
    // Check if any of the required billingState fields are empty
      const isAddressComplete = name && orgName && country && zip && city && region && address && phone
      if (!isAddressComplete) {
        $error('Please fill out all the fields in your billing address.')
        return isFieldEmtpy.value = false
      }
      else {
        isFieldEmtpy.value = true
      }
    }
    if (index >= 3) {
      const validCardDetails = cardHolderName && cardNo && expDate && cvv
      if (!validCardDetails) {
        $error('Please fill out all the fields in your billing card details.')
        return isFieldEmtpy.value = false
      }
      else {
        isFieldEmtpy.value = true
      }
      await billingCardDetailsRef?.value?.validateCardDetails()
      // Wrap in nextTick to ensure reactivity updates
      if (billingCardDetailsValid.value)
        return
    }
  }
  catch (error) {
    $error(error)
  }
  if (index >= 0 && index < steps.length)
    state.activeStep = index
}
function isActive(index: number) {
  return state.activeStep >= index
}
function backStep() {
  if (state.activeStep === 0)
    navigateTo('/website/pricing')
  else
    setActiveStep(state.activeStep - 1)
}
</script>

<template>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Upgrading your new plan...
    </UCard>
  </UModal>
  <div class="grid place-items-center">
    <div class="">
      <ol class="flex">
        <li v-for="(step, index) in steps" :key="index" class="flex items-center">
          <span
            class="rounded-full  px-2.5 py-1 mr-2 text-sm"
            :class="isActive(index) ? 'bg-green-500 text-white cursor-pointer' : 'bg-slate-300'"
            @click="() => setActiveStep(index)"
          >
            {{ index + 1 }}
          </span>
          <span class="mr-4 text-sm" :class="isActive(index) ? 'text-orange-400 font-medium text-lg' : 'text-slate-800'">
            {{ step.label }}
          </span>
        </li>
      </ol>
    </div>
    <UCard v-if="state.activeStep === 0" class="mb-6 mt-4">
      <div class="divide-y divide-solid">
        <header class="flex justify-start">
          AI FlowMapper {{ selectedPlan.planName }}
        </header>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <USelect v-model="user" :options="users" color="blue" />
          <div>
            <span>
              {{ selectedPlan.planType === 'monthly' ? '1 month : ' : '12 months : ' }}</span>
            <span class="font-semibold pl-1">{{ selectedPlan.currencySymbol }}{{ selectedPlan.calculatedPrice }}</span>
          </div>
        </section>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <div>Tax</div>
        </section>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <div class="font-semibold">
            Due today
          </div>
          <div class="font-semibold">
            {{ duePrice }}
          </div>
        </section>
      </div>
    </UCard>
    <BillingAddress v-if="state.activeStep === 1" />
    <BillingPaymentCardDetails v-if="state.activeStep === 2" ref="billingCardDetailsRef" :plan-name="selectedPlan.planName" :due-price="duePrice" @validate-card-details="handleCardValidation" />
    <BillingTaxId v-if="state.activeStep === 3" />
    <BillingReview v-if="state.activeStep === 4" :plan-name="selectedPlan.planName" :due-price="duePrice" />
    <div class="d-flex">
      <span v-if="state.activeStep !== 4">
        <UButton class="mr-5" @click="backStep">
          Back
        </UButton>
        <UButton @click="() => setActiveStep(state.activeStep + 1)">
          Continue
        </UButton>
      </span>

      <UButton v-else class="mt-4" @click="completeOrder">
        Complete order
      </UButton>
    </div>
  </div>
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
