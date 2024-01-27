<script lang="ts" setup>
const authStore = useAuthStore()
const route = useRoute()

const authUser = computed(() => authStore.getAuthUser.value)
// Define the structure of your link objects for better TypeScript support
interface NavLink {
  name: string
  to: string
}

const links = ref<NavLink[]>([
  { name: 'Home', to: '/website' },
  { name: 'About Product', to: '/website/about' },
  { name: 'Pricing', to: '/website/pricing' },
  { name: 'Contact Sales', to: '/website/contact' },
])

function isActiveRoute(to: string) {
  return route.path === to
}
</script>

<template>
  <nav class="flex w-full border-gray-200 dark:bg-gray-900">
    <NuxtLink to="/">
      <div class="flex">
        <img src="/assets/media/logo.png" class="h-8" alt="Flowbite Logo">
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white margin-align">AI Flow
          Mapper</span>
      </div>
    </NuxtLink>
    <ul class="flex w-full items-center justify-center">
      <li
        v-for="link in links" :key="link.name" class="lg:pr-5 font-medium"
        :class="{ 'active-link': isActiveRoute(link.to) }"
      >
        <NuxtLink :to="link.to">
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
    <UButton
      v-if="!authUser" @click="navigateTo({
        path: '/login',
      })"
    >
      Login
    </UButton>
  </nav>
</template>

<style scoped>
.margin-align {
  margin: 0 0 10px 20px;
}

.active-link {
  color: rgb(48, 48, 250);
  font-weight: 700;
}
</style>
