<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Define the structure of your link objects for better TypeScript support
interface NavLink {
  name: string;
  to: string;
}

const links = ref<NavLink[]>([
  { name: 'Home', to: '/' },
  { name: 'About Product', to: '/about' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'Contact Sales', to: '/contact' }
]);

const route = useRoute();

const isActiveRoute = (to: string) => {
  return route.path === to;
};

onMounted(() => {
  // Any additional logic to run after the component is mounted
});
</script>

<template>
  <nav class="flex w-full bg-white border-gray-200 dark:bg-gray-900 pt-6 px-6 pb-3">
    <NuxtLink to="/">
      <div class="flex">
        <img src="/assets/media/logo.png" class="h-8" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap text-blue-700 dark:text-white margin-align">AI Flow
          Mapper</span>
      </div>
    </NuxtLink>
    <ul class="flex w-full items-center justify-center">
      <li v-for="link in links" :key="link.name" class="lg:pr-5 font-medium"
        :class="{ 'active-link': isActiveRoute(link.to) }">
        <NuxtLink :to="link.to">{{ link.name }}</NuxtLink>
      </li>
    </ul>
    <button type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <Icon name="tabler:logout" class="font-medium text-lg" color="white" />
      Login
    </button>
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