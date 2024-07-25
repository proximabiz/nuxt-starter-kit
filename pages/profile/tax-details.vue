<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['redirect'],
})

const globalStore = useGlobalStore()
globalStore.pageHeading.title = 'My Account'
</script>

<template>
  <ProfileGstAndTax/>
</template>
