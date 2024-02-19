<script setup lang="ts">
import { useBillingStore } from '~/stores/subscription'

const notify = useNotification()
const authStore = useAuthStore()
const planStore = useBillingStore()
const addressStore = useAddressStore()

const items = [
  [{
    label: 'ben@example.com',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'My Account',
    icon: 'i-heroicons-cog-8-tooth',
    action: 'navigateToSettings',
    click: () => navigateTo('/profile/account'),
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    action: 'singOut',
    click: () => singOut(),
  }],
]
const authUser = computed(() => authStore.authUser)
const isLoggedIn = computed(() => authStore.isLoggedIn)

async function singOut() {
  try {
    // Do something with data
    const res = await authStore.signOut()
    await planStore.clearSubscription()
    await addressStore.clearAddress()

    if (!isLoggedIn.value)
      navigateTo('/')
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}
</script>

<template>
  <nav class="flex w-full border-gray-200 dark:bg-gray-900 justify-between px-5 my-5">
    <NuxtLink to="/">
      <div class="flex">
        <img src="/assets/media/logo.png" class="h-8" alt="Flowbite Logo">
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white margin-align">AI Flow
          Mapper</span>
      </div>
    </NuxtLink>

    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">
      <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
      <template #account>
        <div class="text-left">
          <p>
            Signed in as
          </p>
          <p class="truncate font-medium text-gray-900">
            {{ authUser.email }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto" />
      </template>
    </UDropdown>

    <!-- <UButton
        v-if="!isLoggedIn" @click="navigateTo({
          path: '/auth',
          query: {
            action: 'signin',
          },
        })"
      >
        Login
      </UButton> -->
  </nav>
</template>

<style scoped>

</style>
