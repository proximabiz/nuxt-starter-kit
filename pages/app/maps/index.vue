<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})
</script>

<template>
  <MapList />
</template>
