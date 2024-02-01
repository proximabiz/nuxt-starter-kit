<script lang="ts" setup>
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
console.log(isLoggedIn)
</script>


<template>
  <!-- Top bar -->
  <LayoutWebsiteTopBar />
  <!-- Middle Scrollable Container -->
  <main class="container mx-auto my-4 p-8 bg-white overflow-y-auto">
    <UContainer class="py-8">
      <slot />
    </UContainer>
  </main>
  <!-- Footer -->
  <LayoutWebsiteFooter />
</template>
