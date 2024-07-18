<script setup>
const route = useRoute()
const { $error } = useNuxtApp()
const supabaseClient = useSupabaseClient()
const subscriptionStore = useSubscriptionStore()

const currentRoutePath = computed(() => route.fullPath)

const links = computed(() => [
  {
    title: 'My Account',
    to: '/profile/account',
    icon: 'i-heroicons-user',
  },
])
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
</script>

<template>
  <div class="flex h-screen w-16 fixed left-0 flex-col justify-between border-e bg-white z-50">
    <div>
      <div class="inline-flex h-16 w-16 items-center justify-center">
        <NuxtLink to="/website">
          <span
            class="grid h-10 w-10 place-content-center rounded-lg text-xs text-gray-600"
          >
            <img src="/assets/media/logo.png" class="" alt="Logo">
          </span>
        </NuxtLink>
      </div>
      <div class="border-t border-gray-100">
        <div class="px-2">
          <div class="py-4">
            <NuxtLink to="/app/diagram/list">
              <a
                class="t group relative flex justify-center rounded px-2 py-1.5" :class="[{ 'text-blue-700 bg-blue-100': currentRoutePath === '/app/diagram/list' }]"
              >
                <UIcon name="i-heroicons-map" class="size-5" />

                <span
                  class="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  My Diagrams
                </span>
              </a>
            </NuxtLink>
          </div>

          <ul class="space-y-1 border-t border-gray-100 pt-4">
            <li v-for="(item, index) in links" :key="index">
              <NuxtLink :to="item.to">
                <a
                  class="t group relative flex justify-center rounded px-2 py-1.5" :class="[{ 'text-blue-700 bg-blue-100': currentRoutePath === item.to }]"
                >
                  <UIcon :name="item.icon" class="size-5" />
                  <span
                    class="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                  >
                    {{ item.title }}
                  </span>
                </a>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
      <button
        class="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        @click="singOut"
      >
        <UIcon name="i-heroicons-arrow-right-on-rectangle" class="size-5" />
        <span
          class="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
        >
          Logout
        </span>
      </button>
    </div>
  </div>
</template>
