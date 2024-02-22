<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['redirect'],
})

const globalStore = useGlobalStore()
globalStore.pageHeading.title = 'My Accounts'
</script>

<template>
  <ProfileMyAccount />
</template>

<style lang="scss" scoped>

</style>
