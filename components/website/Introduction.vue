<script lang="ts" setup>
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <UContainer class="w-full">
    <div class="mt-5 text-center p-6 border-gray-200">
      <div class="flex justify-center items-center">
        <img class="h-20 max-w-20" src="/assets/media/mind.gif" alt="image description">
      </div>
      <a href="#">
        <h5 class="mt-5 text-xl font-bold tracking-tight text-gray-900">Let AI Shape Your Ideas With</h5>
      </a>
      <p class="text-3xl font-bold text-custom1-500 mt-5">
        AI FLOW MAPPER
      </p>
      <p class="mt-5 font-normal text-gray-700">
        This tool is built to Enhance Productivity and Visualize Ideas with AI Flow Mapper.<br>
        It Simplifies the Complex Concepts into Elegant Diagrams.
      </p>
      <UButton v-if="isLoggedIn" class="mt-10" @click="navigateTo('/app/maps')">
        Get Started
      </UButton>
    </div>
  </UContainer>
</template>

<style>
.lineUp {
  animation: 3s anim-lineUp ease-out;
}
@keyframes anim-lineUp {
  0% {
    opacity: 0;
    transform: translateY(80%);
  }
  20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: translateY(0%);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}
</style>
