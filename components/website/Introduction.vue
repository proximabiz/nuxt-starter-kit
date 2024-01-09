<template>
  <UContainer>
    <div class="mt-5 text-center p-6 border-gray-200">
      <div class="flex justify-center items-center">
        <img class="h-auto max-w-10" src="/assets/media/mind.gif" alt="image description">
      </div>
      <a href="#">
        <h5 class="mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Let AI Shape Your Ideas With</h5>
      </a>
      <p class="font-bold text-gray-700 dark:text-gray-400 mt-5">
        AI FLOW MAPPER
      </p>
      <p class="mt-5 font-normal text-gray-700 dark:text-gray-400">
        This tool is built to Enhance Productivity and Visualize Ideas with AI Flow Mapper.<br>
        It Simplifies the Complex Concepts into Elegant Diagrams.
      </p>
      <UButton class="mt-10" icon="i-heroicons-pencil-square" color="blue">Continue with google</UButton>
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
