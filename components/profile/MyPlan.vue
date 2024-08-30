<script setup lang="ts">
import dayjs from 'dayjs'

const { $success, $error } = useNuxtApp()
const subscriptionStore = useSubscriptionStore()
const planData = ref()
const showUpgradeModal = ref<boolean>(false)
const noplanModal = ref<boolean>(false)
const isModalVisible = ref(false)
async function getActivePlan() {
  try {
    const response = await subscriptionStore.fetchActivePlan()
    showUpgradeModal.value = ['PLAN_EXPIRED', 'NO_ACTIVE_SUBSCRIPTION', 'NO_SUBSCRIPTION'].includes(response?.subscription_status)
    planData.value = response
  }
  catch (error) {
    $error(error.statusMessage)
  }
}
async function cancelPlan() {
  const payload = {
    userId: planData.value.user_id,
    userSubscriptionId: planData.value.id,
    note: 'Cancel Subscription',
  }
  try {
    const res = await subscriptionStore.cancelSubscription(payload)
    if (res?.status === 204) {
      noplanModal.value = true
      $success(res.message)
      setTimeout(() => navigateTo('/website/pricing'), 1000)
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}
onMounted(async () => {
  await getActivePlan()
})

function upgradePlan() {
  showUpgradeModal.value = false
  navigateTo('/website/pricing')
}
function upgradePlanNO() {
  noplanModal.value = false
  navigateTo('/website/pricing')
}

function calculateDaysRemainingFromToday(endDateStr: string | undefined) {
  // Use dayjs to get today's date at 00:00:00 to ensure full day calculation
  const today = dayjs().startOf('day')
  const endDate = dayjs(endDateStr).startOf('day')

  // Calculate the difference in days
  let diffDays = endDate.diff(today, 'day')

  // Adjust calculation to include today in the count
  if (endDate.isAfter(today))
    diffDays -= 1
  return diffDays
}
const daysRemaining = computed(() => calculateDaysRemainingFromToday(planData.value?.plan_end_date))
function uptoMindMaps(plan: string) {
  return plan === 'Basic'
    ? 'Up to 4 mindmaps'
    : plan === 'Free'
      ? 'Up to 8 mindmaps'
      : plan === 'Premium'
        ? 'Up to 8 mindmaps'
        : 'Unlimited mindmaps'
}
</script>

<template>
  <ProfileBreadCrumb text="My plan" />
  <UModal :model-value="showUpgradeModal" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        Your plan has expired!
      </p>
      <p> To continue this application, please upgrade.</p>
      <div class="mt-4 flex justify-center">
        <UButton class="" @click="upgradePlan">
          Upgrade
        </UButton>
      </div>
    </div>
  </UModal>
  <UModal :model-value="showUpgradeModal" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        You have no active plan.
      </p>
      <p>To continue using this app please subscribe to any plan.</p>
      <div class="mt-4 flex justify-center">
        <UButton class="" @click="upgradePlanNO">
          Upgrade
        </UButton>
      </div>
    </div>
  </UModal>
  <section class="grid place-items-center mb-8">
    <h1 class="font-semibold my-8">
      My Plan
    </h1>
    <UCard>
      <div v-if="planData?.subscription_status === 'ACTIVE_SUBSCRIPTION'" class="sm:pb-0">
        <h2 class="text-lg font-medium text-gray-900">
          {{ planData?.name }}
        </h2>
        <p class="text-gray-700">
          {{ planData?.description }}
        </p>
        <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">${{ planData?.monthly_price }}<span class="text-sm font-medium text-gray-700">{{ planData?.name === "Free" ? '/15 days' : "/month" }}</span>
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
            <span class="text-gray-700"> {{ uptoMindMaps(planData?.name) }} </span>
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
        <UButton type="submit" class="w-fit mt-2 mr-4" color="blue" disabled>
          Current Plan
        </UButton>
        <UButton v-if="planData?.name !== 'Free'" type="submit" class="w-fit mt-2" color="blue" :disabled="planData?.name === 'Free'" @click="() => { isModalVisible = true }">
          Cancel Subscription
        </UButton>
        <p v-if="planData?.plan_end_date && planData?.name !== 'Free'" class="text-red-500 text-xs mt-2">
          Your plan will be auto renewed on {{ dayjs(planData?.plan_end_date).format('MMMM D, YYYY, h:mm:ss A') }}
        </p>
        <p v-else class="text-red-500 text-xs mt-2">
          Free plan will end in {{ daysRemaining }} days
        </p>
      </div>
      <div v-else>
        <h2 class="text-lg font-medium text-gray-900">
          You do not have an active plan, upgrade plan now to continue creating diagrams.
        </h2>
      </div>
    </UCard>
    <p v-if="planData?.name === 'Free'" class="mt-4">
      To know more about paid plans, please contact us at
      <br><NuxtLink to="mailto:support@flowmapper.ai" class="text-blue-700 underline flex justify-center">
        support@flowmapper.ai
      </NuxtLink>
    </p>
    <NuxtLink v-else to="/website/pricing">
      <h1 class="font-semibold text-blue-700 underline mt-4 hover:text-blue-900 cursor-pointer">
        <i>Upgrade Now By Comparing
          Other Plans</i>
      </h1>
    </NuxtLink>
    <Confirmation
      v-model="isModalVisible"
      :is-open="isModalVisible"
      left-button="Cancel"
      right-button="Confirm"
      text="Are you sure you want to cancel your subscription?"
      @update:is-open="isModalVisible = $event"
      @delete-confirm="cancelPlan"
    />
  </section>
</template>

<style scoped></style>
