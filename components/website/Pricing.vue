<script lang="ts" setup>
const isMonthly = ref(true)
const showBillingDetails = ref(false)
const cardValue = ref()
const region = ref('india')
const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()
const isLoading = ref(true)
const currencyList = ref()

const sub_status = computed(() => subscriptionStore.subscriptionStatus)

const { data: dataFetch } = await useFetch('https://open.er-api.com/v6/latest/USD')
currencyList.value = dataFetch

interface PricePlan {
  plan: string
  price: number | any
  month: number
  disabled: boolean
}
interface regionTypes {
  name: string
  value: string
  currencySymbol: string
  conversionRate: number
}
const regions: regionTypes[] = [
  {
    name: 'India',
    value: 'india',
    currencySymbol: '₹', // Rupees
    conversionRate: currencyList?.value?.value?.rates?.INR, // Assuming 1 USD = 75 Rupees
  },
  {
    name: 'Europe',
    value: 'europe',
    currencySymbol: '€', // Euros
    conversionRate: currencyList?.value?.value?.rates?.EUR, // Assuming 1 USD = 0.9 Euros
  },
  {
    name: 'US',
    value: 'us',
    currencySymbol: '$', // Dollars
    conversionRate: currencyList?.value?.value?.rates?.USD, // Base rate
  },
  {
    name: 'Other region',
    value: 'other',
    currencySymbol: '$', // Dollars
    conversionRate: currencyList?.value?.value?.rates?.USD, // Base rate
  },
]
const basePlane = sub_status?.value.planName !== '' && sub_status?.value.planName === 'Basic'
const premiumPlane = sub_status?.value.planName !== '' && sub_status?.value.planName === 'Premium'

const monthlyPrices: PricePlan[] = [
  { plan: 'Free', price: 0, month: 1, disabled: (authStore.getAuthUser.value?.role === 'authenticated') || sub_status?.value.planName === 'Free' },
  { plan: 'Basic', price: 5, month: 1, disabled: basePlane },
  { plan: 'Premium', price: 8, month: 1, disabled: premiumPlane },
  { plan: 'Enterprise', price: 'Custom', month: 1, disabled: true },
]

const annualPrices: PricePlan[] = reactive([
  { plan: 'Free', price: 0, month: 11, disabled: (authStore.getAuthUser.value?.role === 'authenticated') || sub_status?.value.planName === 'Free' },
  { plan: 'Basic', price: monthlyPrices[1].price * 11, month: 11, disabled: basePlane },
  { plan: 'Premium', price: monthlyPrices[2].price * 11, month: 11, disabled: premiumPlane },
  { plan: 'Enterprise', price: 'Custom', month: 11, disabled: true },
])

const prices = computed(() => {
  const selectedRegion = regions.find(r => r.value === region.value)
  if (!selectedRegion)
    return

  const adjustmentFactor = selectedRegion.conversionRate
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
      calculatedPrice: (plan.price * adjustmentFactor).toFixed(2), // Adjusting the price
      currencySymbol: selectedRegion?.currencySymbol, // Setting the currency symbol
    }
  })
  return adjustedPrices
})

if (sub_status?.value.planName !== '')
  isLoading.value = false

else
  isLoading.value = true

function providePlanDetails(val: any) {
  if (!authStore.getAuthUser.value)
    return navigateTo('/login')

  cardValue.value = val
  showBillingDetails.value = true
  return cardValue
}

// onMounted(async () => {
//   // try {
//   const dataFetch = await useFetch('https://open.er-api.com/v6/latest/USD')
//   currencyData.value = dataFetch
//   return currencyData.value
// })
</script>

<template>
  <BillingDetailsBillling v-if="showBillingDetails" :plan-details="cardValue" />
  <template v-else>
    <div class="text-center my-5">
      <span class="text-3xl font-medium my-5">Choose Your AI FlowMapper Plan</span>
    </div>
    <div class="flex items-center justify-center relative my-5">
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
      <USelect
        v-model="region" :options="regions" option-attribute="name" class="inline-flex ms-4" color="blue" :ui="{
          rounded: 'rounded-xl',
          padding: 'py-10',
        }"
      />
    </div>

    <div class="max-w-screen-xl mx-12 px-4 py-8 sm:px-6 sm:py-4 lg:px-8 lg:py-4 mb-4 text-sm">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8">
        <template v-if="prices && prices.length && !isLoading">
          <div
            v-for="(value, index) in prices" :key="index"
            class="divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div class="p-4 pb-0">
              <h2 class="text-lg font-medium text-gray-900">
                {{ value.plan }}
                <span class="sr-only">Plan</span>
              </h2>
              <p class="text-gray-700">
                No credit card required. Plan valid upto 15 days.
              </p>
              <strong
                class="text-3xl font-bold text-gray-900 sm:text-3xl"
              >
                {{ value.currencySymbol }}{{ value.calculatedPrice }}
              </strong>
              <span class="text-sm font-medium text-gray-700">
                {{ value.price === 'Custom' ? ''
                  : value.plan === 'Free' ? '/15 days' : isMonthly
                    ? '/month' : '/year' }}
              </span>
              <UButton
                class="w-full mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
                :class="[
                  value.disabled ? 'bg-slate-200 border-transparent' : 'hover:bg-transparent hover:text-indigo-600']"
                :disabled="value.disabled" @click="providePlanDetails(value)"
              >
                {{ value.plan === 'Enterprise' ? 'Coming Soon' : 'Get started' }}
              </UButton>
            </div>
            <div class="p-2 sm:px-4">
              <p
                class="text-lg font-medium text-gray-900 sm:text-xl"
              >
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
                  <span class="text-gray-700"> Unlimited mind maps </span>
                </li>
                <li class="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 text-indigo-700"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="text-gray-700"> File,image attachments </span>
                </li>
                <li class="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 text-indigo-700"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="text-gray-700"> PNG image and JSON export </span>
                </li>
                <li class="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 text-indigo-700"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="text-gray-700"> Mindmap printing </span>
                </li>
                <li class="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 text-indigo-700"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span class="text-gray-700"> Version history </span>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>
