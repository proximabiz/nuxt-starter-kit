<script setup lang="ts">
const users = ['1user']
const user = ref(users[0])
const billingStore = useBillingDetailsStore()
const isFieldEmtpy = ref<boolean>(true)
const { $success, $error } = useNuxtApp()

const subscriptionStore = useSubscriptionStore()
const billingAddressCard = computed(() => subscriptionStore.billingDetails)
const duePrice = computed(() => billingStore.propObject.currencySymbol + billingStore.propObject.calculatedPrice)
const { name, orgName, country, zip, city, region, address, phone } = billingAddressCard.value
const steps = [
  { label: 'Your plan', component: 'BillingDetailsBillling' },
  { label: 'Your Address', component: 'BillingAddress' },
  { label: 'Card Details', component: 'BillingCardDetails' },
  { label: 'Tax ID', component: 'TaxId' },
  { label: 'Review your details', component: 'BillingReview' },
]

const state = reactive({
  activeStep: 0,
})

watch([billingAddressCard.value, isFieldEmtpy.value], () => {
  const { cardHolderName, cardNo, expDate, cvv } = billingAddressCard.value

  if (cardHolderName && cardNo && expDate && cvv)
    isFieldEmtpy.value = false
  else
    isFieldEmtpy.value = true
}, { deep: true, immediate: true })

async function setActiveStep(index: number) {
  const { cardHolderName, cardNo, expDate, cvv } = billingAddressCard.value
  isFieldEmtpy.value = true
  if (index >= 2) {
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
    if (!cardHolderName
      && !cardNo
      && !expDate) {
      const response = await subscriptionStore.getCardDetailsAPI()
      const validCardDetails = cardHolderName && cardNo && expDate && cvv

      if ((response?.message || response?.msg === 'no data' || response === undefined) && validCardDetails) {
        try {
          const monthYear = expDate.split('/')
          const payload = {
            cardHolderName,
            cardNumber: cardNo.toString(),
            expiryMonth: Number(monthYear[0]),
            expiryYear: Number(monthYear[1]),
            securityCode: cvv.toString(),
          }
          const newCardAdd = await subscriptionStore.addNewCardDetails(payload)
          if (newCardAdd)
            $success('Your new card details has succussfuly added')
        }
        catch (error) {
          $error(error.data.message)
          return isFieldEmtpy.value = false
        }
      }
      else if ((response?.message || response?.msg === 'no data' || response === undefined) && !validCardDetails) {
        $error('Please fill out all the fields in your billing card details.')
        return isFieldEmtpy.value = false
      }
      else {
        isFieldEmtpy.value = true
      }
    }
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
          AI FlowMapper {{ billingStore.propObject.planName }}
        </header>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <USelect v-model="user" :options="users" color="blue" />
          <div>
            <span>
              {{ billingStore.propObject.planType === 'monthly' ? '1 month : ' : '12 months : ' }}</span>
            <span class="font-semibold pl-1">{{ billingStore.propObject.currencySymbol }}{{ billingStore.propObject.calculatedPrice }}</span>
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
    <BillingCardDetails v-if="state.activeStep === 2" :plan-name="billingStore.propObject.planName" :due-price="duePrice" />
    <BillingTaxId v-if="state.activeStep === 3" />
    <BillingReview v-if="state.activeStep === 4" :plan-name="billingStore.propObject.planName" :due-price="duePrice" />
    <div class="d-flex">
      <UButton v-if="state.activeStep !== 4" class="mr-5" @click="backStep">
        Back
      </UButton>
      <UButton v-if="state.activeStep !== 4" @click="() => setActiveStep(state.activeStep + 1)">
        Continue
      </UButton>
    </div>
  </div>
</template>
