<script lang="ts" setup>
import { useGlobalStore } from '~/stores'
import { useBillingStore } from '~/stores/subscription';

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const notify = useNotification()
const planStore = useBillingStore()
const supabaseClient = useSupabaseClient()

const items = [
  [{
    label: 'ben@example.com',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    action: 'singOut',
    click: () => singOut(),
  }],
]

const authUser = computed(() => authStore.getAuthUser.value)

async function singOut() {
  try {
    // Do something with data
    await supabaseClient.auth.signOut()
    await planStore.clearSubscription()
    navigateTo('/')
  }
  catch (error) {
    notify.error(error)
  }
}
</script>

<template>
  <nav class="border-b h-16 fixed top-0 w-full bg-white ms-16">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
      <div class="ms-5">
        <LayoutAppHeading />
      </div>
      <div id="navbar-default" class="hidden w-full md:block md:w-auto">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
          <li>
            <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">
              <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
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
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
