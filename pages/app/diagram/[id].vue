<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['redirect'],
})

interface RouteParams {
  id: string
}

const route = useRoute()
const diagramId = computed(() => (route.params as RouteParams).id)
</script>

<template>
  <ClientOnly>
    <MapView :diagram-id="diagramId" />
  </ClientOnly>
</template>
