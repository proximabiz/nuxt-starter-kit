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
const userStore = useUserStore()
const features = [
  { name: 'Nuxt UI', url: 'https://nuxt-ui.com/' },
  { name: 'Tailwind', url: 'https://tailwindcss.com/' },
  { name: 'ESLint', url: 'https://eslint.org/' },
  { name: 'Icons', url: 'https://icones.js.org/' },
  { name: 'Fonts', url: 'https://fonts.google.com/' },
  { name: 'Color Mode', url: 'https://nuxt.com/modules/color-mode' },
  { name: 'Pinia', url: 'https://pinia.vuejs.org/' },
  { name: 'i18n', url: 'https://vue-i18n.intlify.dev/' },
  { name: 'Zod', url: 'https://github.com/colinhacks/zod' },
  { name: 'VueUse', url: 'https://vueuse.org/' },
  { name: 'Lodash', url: 'https://lodash.com/' },
  { name: 'Animate', url: 'https://auto-animate.formkit.com/' },
  { name: 'Docker', url: 'https://www.docker.com/' },
  { name: 'Web Vitals', url: 'https://web.dev/explore/learn-core-web-vitals' },

]
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
// Pinia testing
const loader = ref(false)
const getUsersList = computed(() => userStore.getUsers)

async function callAPI() {
  try {
    loader.value = true
    await userStore.fetchUsers()
  }
  catch (error) {
    console.error('Error', error)
  }
  finally {
    loader.value = false
  }
}
const clearUsersList = () => userStore.clearUsers()

const items = ref(['😏', '😐', '😑', '😒', '😕'])
function shuffleItems() {
  items.value = shuffle(items.value)
}
</script>

<template>
  <div>
    <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 gap-16 sm:gap-y-24 max-w-4xl flex flex-col">
        <div class="relative z-[1] text-center">
          <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            <span>A <span class="text-primary animate-pulse">Nuxt Starter Kit</span> for<br class="hidden lg:block"> Modern Web
              Apps</span>
          </h1>
          <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
            <span>Launch Your Nuxt Project with Ease with Nuxt 3 Starter Kit.<br
              class="hidden lg:block"
            > Supercharge your development experience with one powerful kit</span>
          </p>

          <div class="flex justify-center">
            <div class="mt-6 flex flex-wrap gap-x-2 gap-y-2 justify-center max-w-xl">
              <Pill v-for="feature in features" :key="feature.name" :text="feature.name" :link="feature.url" />
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3 justify-center">
            <UButton label="Get Started" icon="lucide:rocket" size="lg" to="#examples" />
          </div>
        </div>
      </div>
      <ClientOnly>
        <HomeTetris />
      </ClientOnly>
    </div>

    <UContainer id="examples" class="py-24">
      <UCard class="m-10">
        <template #header>
          <div class="flex justify-between">
            <h1>{{ $t('welcomeToNuxtStarter') }}</h1>
            <ColorScheme>
              <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
            </ColorScheme>
          </div>
        </template>
        <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">
          Open Nuxt UI Documentation
        </UButton>
      </UCard>

      <UCard class="m-10">
        <h2 class="mb-4">
          Pinia Integration
        </h2>
        <UButton @click="callAPI()">
          Test API
        </UButton>
        <UButton class="ms-4" color="red" @click="clearUsersList">
          Clear Data
        </UButton>

        <h4 class="my-5 font-bold">
          API Response-
        </h4>

        <ClientOnly>
          <UTable :loading="loader" :rows="map(getUsersList, item => pick(item, ['id', 'name', 'username', 'email']))" />
        </ClientOnly>
      </UCard>

      <UCard class="m-10">
        <h2 class="mb-4">
          Auto Animate
        </h2>
        <h5>Click emojis to shuffle them.</h5>
        <ul v-auto-animate class="flex gap-2">
          <UButton v-for="item in items" :key="item" variant="ghost" class="text-xl" @click="shuffleItems(item)">
            {{ item }}
          </UButton>
        </ul>

        <UAlert
          title="Elements SSR"
          description="Rendered on Server Side"
          class="mt-6"
        />
        <Elements />
      </UCard>

      <UCard class="m-10">
        <h2 class="mb-4">
          Locale Switcher
        </h2>
        <AppLocaleSwitcher />
        <h2 class="py-2">
          {{ $t('welcomeToNuxtStarter') }}
        </h2>
      </UCard>

      <UCard class="m-10">
        <template #header>
          <h2>Color Mode</h2>
        </template>
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost"
            aria-label="Theme" @click="isDark = !isDark"
          />

          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </UCard>

      <UCard class="m-10">
        <template #header>
          <h2>Buttons & Tooltips</h2>
        </template>
        <div class="flex justify-start items-center gap-4">
          <UTooltip text="Tooltip example" :shortcuts="['⌘', 'O']">
            <UButton color="green" label="Hover me" icon="lucide:mouse-pointer-click" />
          </UTooltip>

          <UTooltip text="Tooltip example" :shortcuts="['⌘', 'O']" :popper="{ arrow: true }">
            <UButton color="red" variant="outline" label="With Arrow" />
          </UTooltip>

          <UTooltip text="Tooltip example" :shortcuts="['⌘', 'O']" :popper="{ placement: 'top' }">
            <UButton color="black" label="Placement" icon="lucide:move-right" variant="link" trailing />
          </UTooltip>

          <UButton color="blue" variant="solid" icon="i-heroicons-x-mark-20-solid" :loading="true" label="Loading" />
        </div>
      </UCard>

      <div class="m-10 p-7 ring-1 ring-gray-200 shadow rounded-md">
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

      <UCard class="m-10">
        <template #header>
          <h2>SSR</h2>
        </template>
        <h5>Rendered on Server Side</h5>
        <SSRCall />
      </UCard>
    </UContainer>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  font-family: 'Inter', 'Open Sans', sans-serif;
}
</style>
