<script setup lang="ts">
const globalStore = useGlobalStore()

const currentPageHeading = computed(() => {
  return globalStore.pageHeading
})
</script>

<template>
  <h1 id="home" class="text-2xl mb-4 font-extrabold">
    {{ currentPageHeading.title }}
  </h1>
</template>
