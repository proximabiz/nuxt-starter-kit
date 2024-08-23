<script setup lang="ts">
/** Constants */
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const cardDetails = computed(() => subscriptionStore.billingDetails)
const userStore = useUserStore()
const route = useRoute()
/** Refs */
const showUpgradeModal = ref<boolean>(false)
const billingModal = ref<boolean>(false)

/** Computed */
const authUser = computed(() => authStore.getAuthUser.value)

const { cardHolderName, cardNo, expDate, cvv } = cardDetails.value

/** Watcher */
watch(
  () => authUser.value,
  async (user) => {
    if (user?.id) {
      const response = await subscriptionStore.fetchActivePlan()
      await subscriptionStore.getCardDetailsAPI()
      switch (response?.subscription_status) {
        case 'PLAN_EXPIRED':
          showUpgradeModal.value = true
          break
        case 'NO_ACTIVE_SUBSCRIPTION':
          if (!route.fullPath.includes('/profile/account')) {
            const payload = {
              userId: user.id,
              subscriptionTypeId: '10dbc647-04ea-4588-b6c8-7c535049f18c',
              amount: 0,
              email: authUser.value?.email,
            }
            await subscriptionStore.addSubscription(payload)
          }
          break
        case 'ACTIVE_SUBSCRIPTION':
          if (!cardHolderName
            && !cardNo
            && !expDate
            && !cvv
            && user && route.fullPath.includes('/app/diagram/list')
          ) {
            billingModal.value = true
            return navigateTo('/profile/billing-payments')
          }
          break
        default:
          break
      }
    }
    if (user && route.fullPath.includes('/login'))
      return handlePostAuthentication()
  },

  { immediate: true },

)

/** Methods */
function upgradePlan() {
  showUpgradeModal.value = false
  navigateTo('/website/pricing')
}

function addCard() {
  billingModal.value = false
  navigateTo('/profile/billing-payments')
}

async function handlePostAuthentication() {
  // Check if user has filled the personal details already
  const response = await userStore.fetchAddress()
  if (!response)
    return

  if (!response.name || !response?.organisation_name)
    return navigateTo('/user/personal-details')
  return navigateTo('/app/diagram/list')
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

  <UpgradeModal
    v-model="billingModal"
    :is-open="billingModal"
    text="Your card details are missing!\n To continue working with mind maps, please add card details."
    ok="Ok"
    @submit-confirm="addCard"
  />

  <NuxtLayout>
    <NuxtPage />
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
