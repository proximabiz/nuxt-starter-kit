<script setup lang="ts">
const globalStore = useGlobalStore()
const subscriptionStore = useSubscriptionStore()
const diagramStore = useDiagramStore()
const actualDiagramCount = ref(0)
const showUpgrade = ref(false)
const limit = ref(0)
const diagramsList = computed(() => diagramStore.diagramsList)
const sub_status = computed(() => subscriptionStore.subscriptionStatus)

actualDiagramCount.value = diagramsList.value?.length !== undefined ? diagramsList.value?.length : 0

const color = computed(() => {
  switch (true) {
    case limit.value <= 25: return 'green'
    case limit.value <= 50: return 'yellow'
    case limit.value <= 75: return 'orange'
    default: return 'red'
  }
})

onMounted(async () => {
  await diagramStore.list()
  if (sub_status?.value.limitDiagrams === actualDiagramCount.value)
    showUpgrade.value = true
  else
    showUpgrade.value = false
})

watch([actualDiagramCount.value], async () => {
  await diagramStore.list()
}, { deep: true, immediate: true })

const currentPageHeading = computed(() => {
  return globalStore.pageHeading
})
function upgradePlan() {
  navigateTo('/website/pricing')
}

function toPercentage(value: number, max: number) {
  if (max === 0)
    return 0
  return (value / max) * 100
}
const value = actualDiagramCount.value
const max = sub_status?.value?.limitDiagrams
limit.value = toPercentage(value, max)

const validPercentage = (value !== 0 && limit.value !== 0)

const actualDataCountText = `${actualDiagramCount.value} of ${sub_status?.value?.limitDiagrams} diagrams are created`
</script>

<template>
  <div>
    <div class="flex">
      <h1 id="home" class="text-2xl mb-4 font-extrabold">
        {{ currentPageHeading.title }}
      </h1>
      <!-- <UTooltip text="actual-data-count-text" :popper="{ arrow: true }"> -->
      <div v-if="validPercentage" class="ml-5">
        <span>
          {{ actualDataCountText }}
          <UButton v-if="showUpgrade" class="ml-2" :ui="{ rounded: 'rounded-full' }" color="white" variant="solid" @click="upgradePlan">Upgrade</UButton>
          <div class="mt-1">
            <UProgress :value="limit" :max="100" :color="color" />
          </div>
        </span>
      </div>
      <!-- </UTooltip> -->
    </div>
  </div>
</template>
