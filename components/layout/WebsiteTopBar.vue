<script lang="ts" setup>
import avatar from '@/assets/media/user.png'

const route = useRoute()
const router = useRouter()
const { $error } = useNuxtApp()
const authStore = useAuthStore()
const supabaseClient = useSupabaseClient()
const subscriptionStore = useSubscriptionStore()
const isMobileMenuOpen = ref(false)

const authUser = computed(() => authStore.getAuthUser.value)
// Define the structure of your link objects for better TypeScript support
interface NavLink {
  name: string
  to: string
}

const isLoginRoute = computed(() => route.fullPath === '/login')

const links = ref<NavLink[]>([
  { name: 'Home', to: '/website' },
  { name: 'About', to: '/website/about' },
  { name: 'Pricing', to: '/website/pricing' },
  { name: 'Contact Us', to: '/website/contact' },
  { name: 'FAQ', to: '/website/faq' },
])

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function navigateTo(path: string) {
  router.push(path)
  isMobileMenuOpen.value = false // Close mobile menu on navigation
}

const items = [
  [{
    label: 'ben@example.com',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'My account',
    icon: 'i-heroicons-user',
    to: '/profile/account',
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    action: 'singOut',
    click: () => singOut(),
  }],
]
async function singOut() {
  try {
    // Do something with data
    await supabaseClient.auth.signOut()
    await subscriptionStore.clearSubscription()

    navigateTo('/')
  }
  catch (error) {
    $error(error)
  }
}
function isActiveRoute(to: string) {
  return route.path === to
}
</script>

<template>
  <nav class="px-4 py-4 flex justify-between items-center bg-white fixed top-0 w-full z-50">
    <a class="text-3xl font-bold leading-none" href="#">
      <img src="/assets/media/logo.png" class="h-10" alt="Logo" @click="navigateTo('/website')">
    </a>
    <!-- hambergur icon -->
    <div v-if="!authUser" class="lg:hidden">
      <button class="lg:hidden text-blue-600 p-3" @click="toggleMobileMenu">
        <UIcon name="i-heroicons-bars-3" class="size-7" />
      </button>
    </div>

    <!-- Desktop Menu -->
    <ul v-if="!authUser" class="hidden lg:flex lg:space-x-6">
      <template v-for="(item, index) in links" :key="index">
        <li>
          <a
            class="text-sm text-gray-400 hover:text-gray-500 cursor-pointer"
            :class="{ 'active-link': isActiveRoute(item.to) }" @click="navigateTo(item.to)"
          >{{ item.name }}</a>
        </li>
        <li class="text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" class="w-4 h-4 current-fill"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </li>
      </template>
    </ul>
    <UButton
      v-if="!authUser && !isLoginRoute" class="hidden lg:inline-block py-2 px-6" @click="navigateTo({
        path: '/login',
      })"
    >
      Login
    </UButton>

    <!-- mobile menu -->
    <USlideover v-model="isMobileMenuOpen" class="lg:hidden">
      <button class="absolute top-5 right-5" @click="toggleMobileMenu">
        <UIcon name="i-heroicons-x-mark" class="size-7" />
      </button>
      <ul class="pt-3 ps-3">
        <li v-for="link in links" :key="link.name" class="mb-1">
          <a
            class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
            @click.prevent="navigateTo(link.to)"
          >
            {{ link.name }}
          </a>
        </li>
      </ul>
    </USlideover>

    <UDropdown
      v-if="authUser" :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
      :popper="{ placement: 'bottom-start' }" class="z-50"
    >
      <UAvatar :src="avatar" />
      <template #account>
        <div class="text-left">
          <p>
            Signed in as
          </p>
          <p class="truncate font-medium text-gray-900">
            {{ authUser?.email }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto" />
      </template>
    </UDropdown>
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
