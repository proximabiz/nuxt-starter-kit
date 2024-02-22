<script setup>
const route = useRoute()
const currentRoutePath = computed(() => route.fullPath)

const links = computed(() => [
  {
    title: 'Account',
    to: '/profile/account',
    icon: 'i-heroicons-user',
  },
])
</script>

<template>
  <div>
    <div class="flex h-screen w-16 fixed left-0 flex-col justify-between border-e bg-white z-20">
      <div>
        <div class="inline-flex h-16 w-16 items-center justify-center">
          <NuxtLink to="/website">
            <span
              class="grid h-10 w-10 place-content-center rounded-lg text-xs text-gray-600"
            >
              <img src="/assets/media/logo.png" class="" alt="Flowbite Logo">
            </span>
          </NuxtLink>
        </div>
        <div class="border-t border-gray-100">
          <div class="px-2">
            <div class="py-4">
              <NuxtLink to="/app/maps">
                <a
                  class="t group relative flex justify-center rounded px-2 py-1.5" :class="[{ 'text-blue-700 bg-blue-100': currentRoutePath === '/app/maps' }]"
                >
                  <UIcon name="i-heroicons-map" class="size-5" />

                  <span
                    class="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                  >
                    My Maps
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
        <form action="/logout">
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span
              class="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
            >
              Logout
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
