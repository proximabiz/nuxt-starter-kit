<script setup lang="ts">
const globalStore = useGlobalStore()
const subscriptionStore = useSubscriptionStore()
const diagramStore = useDiagramStore()
const digramCount = ref(0)
const diagramsList = computed(() => diagramStore.diagramsList)

const sub_status = computed(() => subscriptionStore.subscriptionStatus)
const cardDetails = computed(() => subscriptionStore.billingDetails)

// const diagramPercentage = computed(() => diagramStore.diagramPercentage)

digramCount.value = sub_status.value.plan_type === 'monthly' ? Number(sub_status.value.monthly_price) : Number(sub_status.value.yearly_price)

const color = computed(() => {
  switch (true) {
    case Number(cardDetails?.value?.diagramPercentage) <= 25: return 'green'
    case Number(cardDetails?.value?.diagramPercentage) <= 50: return 'yellow'
    case Number(cardDetails?.value?.diagramPercentage) <= 75: return 'orange'
    default: return 'red'
  }
})

const currentPageHeading = computed(() => {
  return globalStore.pageHeading
})
function upgradePlan() {
  navigateTo('/website/pricing')
}

const validPercentage = (diagramsList.value !== null && cardDetails.value.diagramPercentage !== '')
</script>

<template>
  <div>
    <div class="flex">
      <h1 id="home" class="text-2xl mb-4 font-extrabold">
        {{ currentPageHeading.title }}
      </h1>
      <div v-if="validPercentage" class="ml-5">
        <span>
          {{ cardDetails?.actualDiagramCount }} of {{ sub_status.plan_type === 'monthly' ? sub_status.monthly_price : sub_status.yearly_price }} diagrams are created
          <UButton v-if="digramCount === Number(cardDetails.actualDiagramCount)" class="ml-2" :ui="{ rounded: 'rounded-full' }" color="white" variant="solid" @click="upgradePlan">Upgrade</UButton>
          <div class="mt-1">
            <UProgress :value="Number(cardDetails.diagramPercentage)" :max="100" :color="color" />
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
