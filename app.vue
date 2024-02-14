<script setup lang="ts">
import { useBillingStore } from '~/stores/subscription'

const authStore = useAuthStore()
const route = useRoute()

const authUser = computed(() => authStore.getAuthUser.value)
const planStore = useBillingStore()

const showUpgradeModal = ref<boolean>(false)

watch(
  () => authUser.value,
  async (user) => {
    if (!user && !route.fullPath.includes('/login'))
      navigateTo('/login')

    if (user && route.fullPath.includes('/login'))
      navigateTo('/')

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
</script>

<template>
  <UModal :model-value="showUpgradeModal" :transition="false">
    <div class="p-8">
      <div class="mb-8">
        Your plan has expired!...
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="gray" @click="upgradePlan">
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
