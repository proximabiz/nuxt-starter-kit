<script setup lang="ts">
import { useBillingStore } from '~/stores/subscription'

const authStore = useAuthStore()
const route = useRoute()

const authUser = computed(() => authStore.getAuthUser.value)
const planStore = useBillingStore()

const showUpgradeModal=ref<boolean>(false)

watch(
  () => authUser.value,
  async (user) => {
    if (!user && !route.fullPath.includes('/login')) {
      navigateTo('/login');
    }
    if (user && route.fullPath.includes('/login')) {
      navigateTo('/');
    }
    if (user?.id) {
      const response = await planStore.fetchActivePlan();
      if (response?.subscription_status === "PLAN_EXPIRED") {
        showUpgradeModal.value=true
       
      } else if (response.subscription_status === "NO_SUBSCRIPTION") {
        let payload = {
          userId: user.id, 
          subscriptionTypeId: "10dbc647-04ea-4588-b6c8-7c535049f18c",
          amount: 0 
        };
        if (!route.fullPath.includes('/profile/account')) {
          await planStore.addSubscription(payload);
        }
      }
    }
  },
  { immediate: true }
);

</script>

<template> 
  <Upgrade :isOpen="showUpgradeModal" @update:is-open="showUpgradeModal"/>
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
