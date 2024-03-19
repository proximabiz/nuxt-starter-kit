<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="min-h-screen grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
      <div class="bg-custom1-500 h-full flex items-center justify-center text-center p-8">
        <div class="text-white text-center">
          <a href="#">
            <h5 class="mt-5 text-xl font-bold tracking-tight text-white underline">Let AI Shape Your Ideas With</h5>
          </a>
          <p class="text-4xl font-bold  mt-5">
            AI FLOWMAPPER
          </p>
        </div>
      </div>

      <div class="lg:col-span-2 px-12 flex justify-center items-center">
        <div>
          <Auth />
        </div>
      </div>
    </div>
  </div>
</template>
