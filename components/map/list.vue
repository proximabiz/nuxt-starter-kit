<script lang="ts" setup>
const mindmapStore = useMindmapStore()
const notify = useNotification()

const maps = computed(() => mindmapStore.maps)

async function fetchMaps() {
  try {
    await mindmapStore.list()
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}

onMounted(() => {
  fetchMaps()
})
</script>

<template>
  <div class="flex">
    <UCard class="w-64 min-h-64 mx-auto inline-flex align-center justify-center items-center">
      <UIcon name="i-heroicons-plus" class="text-2xl" />
    </UCard>
    <UCard v-for="(item, index) in maps" :key="index" class="w-64 mx-auto">
      <template #header>
        <div class="font-bold">
          {{ item.title }}
        </div>
      </template>

      Some Description or image

      <template #footer>
        <UButton @click="navigateTo(`/app/maps/${item.id}`)">
          Start Editing
        </UButton>
      </template>
    </UCard>
  </div>
</template>
