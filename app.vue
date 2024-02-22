<script setup lang="ts">
import { useBillingStore } from '~/stores/subscription'

const authStore = useAuthStore()
const route = useRoute()

const authUser = computed(() => authStore.getAuthUser.value)
const planStore = useBillingStore()
const addressStore = useAddressStore()

const showUpgradeModal = ref<boolean>(false)

watch(
  () => authUser.value,
  async (user) => {
    if (!user && !route.fullPath.includes('/login'))
      navigateTo('/login')

    if (user && route.fullPath.includes('/login'))
      return handlePostAuthentication()

    if (user?.id) {
      const response = await planStore.fetchActivePlan()
      if (response?.subscription_status === 'PLAN_EXPIRED') {
        showUpgradeModal.value = true
      }
      else if (response.subscription_status === 'NO_SUBSCRIPTION') {
        const payload = {
          userId: user.id,
          subscriptionTypeId: '10dbc647-04ea-4588-b6c8-7c535049f18c',
          amount: 0,
        }
        if (!route.fullPath.includes('/profile/account'))
          await planStore.addSubscription(payload)
      }
    }
  },
  { immediate: true },
)

function upgradePlan() {
  showUpgradeModal.value = false
  navigateTo('/website/pricing')
}

async function handlePostAuthentication() {
  // Check if user has filled the personal details already
  const response = await addressStore.fetchAddress()
  if (!response.name || !response.organisation_name)
    return navigateTo('/user/personal-details')
  return navigateTo('/app/maps')
}
</script>

<template>
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
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
