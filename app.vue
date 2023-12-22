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

const countries = ['India', 'United States', 'Canada', 'Mexico']
const country = ref(countries[0])
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
const selected = ref([])

const peoples = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member',
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin',
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member',
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin',
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner',
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member',
}]
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

      <div class="m-10 p-7 border rounded-md shadow-sm">
        <h2 class="mb-4">
          Selects
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <USelect v-model="country" :options="countries" />
          <USelectMenu
            v-model="selected" :options="people" multiple searchable
            searchable-placeholder="Search a person..." :padded="true" placeholder="Select people"
          />
        </div>
      </div>

      <UCard class="m-10">
        <template #header>
          <h2>Table</h2>
        </template>
        <UTable :rows="peoples" />
      </UCard>
    </UContainer>
  </div>
</template>
