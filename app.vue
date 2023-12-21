<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <div>
    <UContainer>
      <UCard class="m-10">
        <template #header>
          <div class="flex justify-between">
            <h1>Welcome to Nuxt UI Starter</h1>
            <ColorScheme><USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" /></ColorScheme>
          </div>
        </template>
        <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">
          Open Nuxt UI Documentation
        </UButton>
      </UCard>

      <UCard class="m-10">
        <template #header>
          <h2>Color Mode</h2>
        </template>
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />

          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </UCard>
    </UContainer>
  </div>
</template>
