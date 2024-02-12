<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import dayjs from 'dayjs';

const notify = useNotification()
const planStore = useBillingStore()
const planData=ref()

async function getActivePlan() {
  try {
    const response = await planStore.fetchActivePlan()
  planData.value=response[0]
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}
onMounted(async () => {
  await getActivePlan()
})
</script>

<template>
  <UBreadcrumb
    divider=">"
    :links="[{ label: 'My Account', to: '/profile/account' }, { label: 'My Plan' }]"
  />
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold mb-4">
      My Plan
    </h1>
    <UCard>
      <div class="sm:pb-0">
        <h2 class="text-lg font-medium text-gray-900">
         {{ planData?.name }}
        </h2>
        <p class="text-gray-700">
          {{ planData?.description }}
        </p>
        <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">${{ planData?.monthly_price }}<span class="text-sm font-medium text-gray-700">/month</span>
        </strong>
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
        <UButton type="submit" class="w-fit mt-2 mr-4" color="blue" disabled>
          Current Plan
        </UButton>
        <UButton type="submit" class="w-fit mt-2" color="blue">
          Cancel Subscription
        </UButton>
        <p class="text-red-500 text-xs">
          Your plan will be auto renewed on {{ dayjs(planData?.plan_end_date).format('MMMM D, YYYY, h:mm:ss A')  }}
        </p>
      </div>
    </UCard>
    <NuxtLink to="/website/pricing">
      <h1 class="font-semibold text-blue-700 mt-4 hover:text-blue-900 cursor-pointer">
        <i>Upgrade Now By Comparing
          Other Plans</i>
      </h1>
    </NuxtLink>
  </section>
</template>

<style scoped></style>
