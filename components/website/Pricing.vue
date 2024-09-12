<script lang="ts" setup>
const isMonthly = ref<boolean>(true)
const cardValue = ref()
const region = ref<string>('us')
const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()
const isLoading = ref<boolean>(true)
const currencyList = ref()
const getPlanName = ref()
const isLoadingPrices = ref<boolean>(false)

const sub_status = computed(() => subscriptionStore.subscriptionStatus)

const currency = await subscriptionStore.getCountryCurrencyData()
const getPlanData = await subscriptionStore.fetchActivePlan()
const pricingData = computed(() => subscriptionStore.pricingData)
const selectedPlan = computed(() => subscriptionStore.selectedPlan)

if (currency !== '')
  currencyList.value = currency
getPlanName.value = getPlanData

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
    conversionRate: currencyList?.value?.rates?.INR, // Assuming 1 USD = 75 Rupees
  },
  {
    name: 'Europe',
    value: 'europe',
    currencySymbol: '€', // Euros
    conversionRate: currencyList?.value?.rates?.EUR, // Assuming 1 USD = 0.9 Euros
  },
  {
    name: 'US',
    value: 'us',
    currencySymbol: '$', // Dollars
    conversionRate: currencyList?.value?.rates?.USD, // Base rate
  },
  {
    name: 'Other region',
    value: 'other',
    currencySymbol: '$', // Dollars
    conversionRate: currencyList?.value?.rates?.USD, // Base rate
  },
]

onMounted(async () => {
  await subscriptionStore.getPriceCardDetails()
})

const prices = computed(() => {
  const selectedRegion = regions.find(r => r.value === region.value)

  if (!selectedRegion)
    return

  const adjustmentFactor = selectedRegion.conversionRate
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  const adjustedPrices = Array.isArray(pricingData.value) && pricingData.value.sort((a, b) => a.sno - b.sno).map((plan) => {
    const isMonthDisabled = isMonthly.value && getPlanName.value.plan_type === 'monthly'
    const isAnnualDiabled = !isMonthly.value && getPlanName.value.plan_type === 'yearly'
    const planPrice = isMonthly.value ? plan.monthlyprice : plan.yearlyprice
    const disabledPlan = plan.name === 'Free'
      ? (authStore.getAuthUser.value?.role === 'authenticated') || sub_status?.value.planName === plan.name
      : plan.name === 'Enterprise'
        ? true
        : getPlanName.value.name !== null && isMonthly.value ? (getPlanName.value.name === plan.name && isMonthDisabled) : (getPlanName.value.name === plan.name && isAnnualDiabled)
    return {
      ...plan,
      calculatedPrice: (planPrice * adjustmentFactor).toFixed(2), // Adjusting the price
      currencySymbol: selectedRegion?.currencySymbol, // Setting the currency symbol
      disabled: disabledPlan,
      featureData: isMonthly.value ? plan?.features?.monthly?.includedItems : plan?.features?.annually?.includedItems,
    }
  })
  return adjustedPrices
})

if (currencyList.value !== '')
  isLoading.value = false
else
  isLoading.value = true

function providePlanDetails(val: any) {
  // const currencyCode = val.currency
  // const planDetails = { ...val, planName: val.name, planType: isMonthly.value ? 'monthly' : 'yearly', currencyCode }
  if (!authStore.getAuthUser.value)
    return navigateTo('/login')
  cardValue.value = val

  selectedPlan.value.planName = val.name
  selectedPlan.value.disabled = val.disabled
  selectedPlan.value.calculatedPrice = val.calculatedPrice
  selectedPlan.value.currencySymbol = val.currencySymbol
  selectedPlan.value.planType = isMonthly.value ? 'monthly' : 'yearly'
  selectedPlan.value.currencyCode = val.currency
  selectedPlan.value.id = val.id

  navigateTo('/plan/upgrade-plan')
  return cardValue
}
</script>

<template>
  <UModal v-model="isLoadingPrices">
    <UProgress animation="carousel" />
    <UCard>
      Fetching your <span class="font-bold">Plan Prices.</span>
    </UCard>
  </UModal>
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
              {{ value.name }}
              <span class="sr-only">Plan</span>
            </h2>
            <p class="text-gray-700">
              {{ value.description }}
            </p>
            <strong
              class="text-3xl font-bold text-gray-900 sm:text-3xl"
            >
              {{ value.currencySymbol }}{{ value.calculatedPrice }}
            </strong>
            <span class="text-sm font-medium text-gray-700">
              {{ (value.monthlyprice === 0 && value.name === 'Free') ? '/15 days' : isMonthly
                ? '/month' : '/year' }}
            </span>
            <UButton
              class="w-full mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
              :class="[
                value.disabled ? 'bg-slate-200 border-transparent' : 'hover:bg-transparent hover:text-indigo-600']"
              :disabled="value.disabled" @click="providePlanDetails(value)"
            >
              {{ value.name === 'Enterprise' ? 'Coming Soon' : 'Get started' }}
            </UButton>
          </div>
          <div class="p-2 sm:px-4">
            <p
              class="text-lg font-medium text-gray-900 sm:text-xl"
            >
              What's included:
            </p>
            <ul v-for="(feature, i) in value?.featureData" :key="i" class="mt-2 space-y-2 sm:mt-2">
              <li class="flex items-center gap-1">
                <svg
                  v-if="feature.icon === 'checkmark'"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-indigo-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5 text-red-700"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-700"> {{ feature?.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
