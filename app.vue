<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const authUser = computed(() => authStore.getAuthUser.value)

watch(
  () => authUser.value,
  (user) => {
    if (!user && !route.fullPath.includes('/login'))
      navigateTo('/login')
    if (user && route.fullPath.includes('/login'))
      navigateTo('/')
  },
  { immediate: true },
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
