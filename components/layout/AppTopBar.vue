<script lang="ts" setup>
import { useGlobalStore } from '~/stores'

const globalStore = useGlobalStore()
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <div>
        <UButton
          :padded="false"
          color="blue"
          variant="link"
          size="xl"
          icon="i-heroicons-bars-3" @click="globalStore.toggleDrawer()"
        />
        <UButton
          color="blue"
          variant="link"
          size="xl"
          class="ms-5"
          icon="i-heroicons-home" @click="navigateTo('/')"
        />
      </div>
      <div id="navbar-default" class="hidden w-full md:block md:w-auto">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <UPopover>
              <UAvatar
                size="sm"
                src="https://avatars.githubusercontent.com/u/739984?v=4"
                alt="Avatar"
              />

              <template #panel="{ close }">
                <div class="p-8">
                  some info
                </div>
              </template>
            </UPopover>
          </li>
          <li>
            <UButton label="Logout" color="blue" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
