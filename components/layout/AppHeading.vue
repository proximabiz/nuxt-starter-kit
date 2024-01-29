<script setup lang="ts">
const route = useRoute()

const currentPageHeading = computed(() => {
  switch (route.fullPath) {
    case '/profile/account':

      return 'My Account'
    case '/profile/plans':

      return 'My Plans'
    case '/app/maps':

      return 'My Maps'

    default:
      break
  }
})
</script>

<template>
  <h1 id="home" class="text-2xl mb-4 font-extrabold">
    {{ currentPageHeading }}
  </h1>
</template>
