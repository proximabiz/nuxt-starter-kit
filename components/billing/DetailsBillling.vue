<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'

interface Props {
  planDetails: any
}
const props = defineProps<Props>()
const users = ['1user']
const user = ref(users[0])
const duePrice = ref('77.8$')
const billingState = useBillingStore()

const steps = [
  // {label: '', component: 'websitePricing'},
  { label: 'Your plan', component: 'BillingDetailsBillling' },
  { label: 'Your Address', component: 'BillingAddress' },
  { label: 'Card Details', component: 'BillingCardDetails' },
  { label: 'Review your details', component: 'BillingReview' },
]

const state = reactive({
  activeStep: 0,
})

function setActiveStep(index: number) {
  if (index === 2) {
    // Check if any of the required billingState fields are empty
    const isAddressComplete = billingState.name && billingState.orgName && billingState.country && billingState.zip && billingState.city && billingState.region && billingState.address && billingState.phone
    if (!isAddressComplete) {
      alert('Please fill out all the fields in your billing address.')
      return
    }
  }
  if (index === 3) {
    const isCardDetailsComplete = billingState.cardHolderName && billingState.cardNo && billingState.expDate && billingState.cvv
    if (!isCardDetailsComplete) {
      alert('Please fill out all the fields in your billing card details.')
      return
    }
  }

  if (index >= 0 && index < steps.length)
    state.activeStep = index
}
function isActive(index: number) {
  return state.activeStep >= index
}
</script>

<template>
  <div class="grid place-items-center mt-4">
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

    <!-- <UBreadcrumb :links="steps" divider="" :ui="{ ol: 'gap-x-3' }" class="mb-4">
      <template #icon="{ link, index }">
        <UAvatar
          :alt="(index + 1).toString()" :ui="{
            background: isActive(index) ? 'bg-primary-500 dark:bg-primary-400' : undefined,
            placeholder: isActive(index) ? 'text-white dark:text-gray-900' : 'group-hover:text-gray-700 dark:group-hover:text-gray-200',
          }" size="xs" @click="prevStep"
        />
      </template>
    </UBreadcrumb> -->

    <UCard v-if="state.activeStep === 0" class="mb-6 mt-4">
      <div class="divide-y divide-solid">
        <header class="flex justify-start">
          AI Flow mapper {{ props.planDetails.plan }}
        </header>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <USelect v-model="user" :options="users" color="blue" />
          <div>
            <span>{{ props.planDetails.month }} {{ props.planDetails.month > 1 ? "months" : "month" }} *
              {{ props.planDetails.price }}</span>
            <span class="font-semibold pl-1">{{ props.planDetails.calculatedPrice }}{{
              props.planDetails.currencySymbol }}</span>
          </div>
        </section>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <div>Tax</div>
          <div class="">
            $11.88
          </div>
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
    <BillingReview v-if="state.activeStep === 3" :plan-name="props.planDetails.plan" :due-price="duePrice" />
    <UButton v-if="state.activeStep !== 3" @click="() => setActiveStep(state.activeStep + 1)">
      Continue
    </UButton>
  </div>
</template>

<style scoped></style>
