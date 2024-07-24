<script setup lang="ts">
interface Props {
  planDetails: any
}
const props = defineProps<Props>()
const users = ['1user']
const user = ref(users[0])
const duePrice = ref<string>(props.planDetails.currencySymbol + props.planDetails.calculatedPrice)
const { $error } = useNuxtApp()

// const confirmation = reactive({
//   isModalVisible: false,
//   context: '',
// })
const subscriptionStore = useSubscriptionStore()
const billingAddressCard = computed(() => subscriptionStore.billingDetails)

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

function setActiveStep(index: number) {
  const bac = billingAddressCard.value
  if (index === 2) {
    // Check if any of the required billingState fields are empty
    const isAddressComplete = bac.name && bac.orgName && bac.country && bac.zip && bac.city && bac.region && bac.address && bac.phone
    if (!isAddressComplete) {
      $error('Please fill out all the fields in your billing address.')
      return
    }
  }
  if (index === 3) {
    const isCardDetailsComplete = bac.cardHolderName && bac.cardNo && bac.expDate && bac.cvv
    if (!isCardDetailsComplete) {
      $error('Please fill out all the fields in your billing card details.')
      return
    }
  }
  // if (index === 4) {
  //   const isCardDetailsComplete = bac.taxId
  //   if (!isCardDetailsComplete) {
  //     $error('Please fill out the Tax Id field in your billing process')
  //     return
  //   }
  // }
  if (index >= 0 && index < steps.length)
    state.activeStep = index
}
function isActive(index: number) {
  return state.activeStep >= index
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
          AI FlowMapper {{ props.planDetails.plan }}
        </header>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <USelect v-model="user" :options="users" color="blue" />
          <div>
            <span>1 month *
              {{ props.planDetails.month > 1 ? props.planDetails.month : '' }}</span>
            <span class="font-semibold pl-1">{{ props.planDetails.currencySymbol }}{{ props.planDetails.calculatedPrice }}</span>
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
    <BillingCardDetails v-if="state.activeStep === 2" :plan-name="props.planDetails.plan" :due-price="duePrice" />
    <BillingTaxId v-if="state.activeStep === 3" />
    <BillingReview v-if="state.activeStep === 4" :plan-name="props.planDetails.plan" :due-price="duePrice" />
    <UButton v-if="state.activeStep !== 4" @click="() => setActiveStep(state.activeStep + 1)">
      Continue
    </UButton>
  </div>
</template>
