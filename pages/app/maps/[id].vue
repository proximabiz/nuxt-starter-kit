<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

const route = useRoute()
const diagramId = computed(() => route.params.id)
</script>

<template>
  <ClientOnly>
    <MapView :diagram-id="diagramId" />
  </ClientOnly>
</template>
