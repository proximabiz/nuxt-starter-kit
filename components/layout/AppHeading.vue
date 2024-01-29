<script setup lang="ts">
const route = useRoute()

const currentPageHeading = computed(() => {
  if (route.fullPath === '/profile/account')
    return 'My Account'
  if (route.fullPath === '/app/maps')
    return 'My Maps'
  if (/\/app\/maps\/[\d-]+/.test(route.fullPath))
    return 'My Map'
  return 'My Heading'
})
</script>

<template>
  <h1 id="home" class="text-2xl mb-4 font-extrabold">
    {{ currentPageHeading }}
  </h1>
</template>
