<script lang="ts" setup>
const isMonthly = ref(true)
const currentPlan = ref('')
const showBillingDetails = ref(false)
let cardValue = ref()
const region = ref('india')

interface PricePlan {
  plan: string
  price: number | any
  month: number
}
const regions = [
  {
    name: 'India',
    value: 'india',
    currencySymbol: '₹', // Rupees
    conversionRate: 75, // Assuming 1 USD = 75 Rupees
  },
  {
    name: 'Europe',
    value: 'europe',
    currencySymbol: '€', // Euros
    conversionRate: 0.9, // Assuming 1 USD = 0.9 Euros
  },
  {
    name: 'US',
    value: 'us',
    currencySymbol: '$', // Dollars
    conversionRate: 1, // Base rate
  },
  {name: 'Other region',
    value: 'other',
    currencySymbol: '$', // Dollars
    conversionRate: 1, 
  }
]

const monthlyPrices: PricePlan[] = [
  { plan: 'Free', price: 0, month: 1 },
  { plan: 'Basic', price: 2, month: 1 },
  { plan: 'Premium', price: 5, month: 1 },
  { plan: 'Enterprise', price: 'Custom', month: 1 },
]

const annualPrices: PricePlan[] = [
  { plan: 'Free', price: 0, month: 11 },
  { plan: 'Basic', price: monthlyPrices[1].price * 11, month: 11 },
  { plan: 'Premium', price: monthlyPrices[2].price * 11, month: 11 },
  { plan: 'Enterprise', price: 'Custom', month: 11 },
]

const prices = computed(() => {
  const selectedRegion = regions.find(r => r.value === region.value)
  const adjustmentFactor = selectedRegion?.conversionRate
  const adjustedPrices = (isMonthly.value ? monthlyPrices : annualPrices).map((plan) => {
    if (plan.price === 'Custom') {
      return {
        ...plan,
        calculatedPrice: plan.price, // Use the string 'Free' or 'Custom' directly
        currencySymbol: '', // No currency symbol for 'Free' or 'Custom' plans
      }
    }

    return {
      ...plan,
      calculatedPrice: plan.price * adjustmentFactor, // Adjusting the price
      currencySymbol: selectedRegion?.currencySymbol, // Setting the currency symbol
    }
  })
  return adjustedPrices
})

function providePlanDetails(val: any) {
  cardValue = val
  showBillingDetails.value = true
  return cardValue
}
</script>

<template>
  <BillingDetailsBillling v-if="showBillingDetails" :plan-details="cardValue" />
  <template v-else>
    <div class="text-center">
      <span class="text-3xl font-medium">Choose Your AI Flow Mapper Plan</span>
    </div>
    <div class="flex items-center justify-center relative">
      <div class="rounded-full border mt-2">
        <label for="Toggle4" class="inline-flex items-center p-1 cursor-pointer dark:bg-gray-300 dark:text-gray-800">
          <input id="Toggle4" type="checkbox" class="hidden peer" @change="isMonthly = !isMonthly">
          <span
            :class="{ 'bg-indigo-600 text-white': isMonthly, 'text-gray-700': !isMonthly }"
            class="px-3 py-1 rounded-full font-medium"
          >Monthly</span>
          <span
            :class="{ 'bg-indigo-600 text-white': !isMonthly, 'text-gray-700': isMonthly }"
            class="px-3 py-1 rounded-full font-medium"
          >Annually</span>
        </label>
      </div>

      <USelect v-model="region" :options="regions" option-attribute="name" class="absolute right-20" color="blue" />
    </div>

    <div class="max-w-screen-xl mx-12 px-4 py-8 sm:px-6 sm:py-4 lg:px-8 lg:py-4 mb-4 text-sm">
      <div class="grid place-items-center grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-4 md:gap-8">
        <div
          v-for="(value, index) in prices" :key="index"
          class="divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div class="p-4 sm:pt-4 sm:pb-0">
            <h2 class="text-lg font-medium text-gray-900">
              {{ value.plan }}
              <span class="sr-only">Plan</span>
            </h2>
            <p class="text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">
             {{ value.currencySymbol}}{{value.calculatedPrice}}
            </strong>
            <span class="text-sm font-medium text-gray-700">{{ value.price === 'Custom' ? ''
              : isMonthly
                ? '/month' : '/year' }}</span>
            <UButton
              class="w-full mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
              :disabled="value.plan === currentPlan" @click="providePlanDetails(value)"
            >
              {{ value.price === 'Custom' ? 'Contact Sales' : 'Get Started' }}
            </UButton>
          </div>
          <div class="p-2 sm:px-4">
            <p class="text-lg font-medium text-gray-900 sm:text-xl">
              What's included:
            </p>
            <ul class="mt-2 space-y-2 sm:mt-2">
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-indigo-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-gray-700"> 10 users </span>
              </li>
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-indigo-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-gray-700"> 2GB of storage </span>
              </li>
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-indigo-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-gray-700"> Email support </span>
              </li>
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-red-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-700"> Help center access </span>
              </li>
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-red-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-700"> Phone support </span>
              </li>
              <li class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-red-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-700"> Community access </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
