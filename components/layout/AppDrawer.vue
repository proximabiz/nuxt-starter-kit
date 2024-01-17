<script setup>
import { useGlobalStore } from '~/stores'

const globalStore = useGlobalStore()

const links = [{
  label: 'My Maps',
  icon: 'i-heroicons-list-bullet',
  to: '/getting-started/installation',

}, {
  label: 'Create Map',
  icon: 'i-heroicons-plus',
  to: '/getting-started/installation',
}, {
  label: 'My Account',
  icon: 'i-heroicons-cog-6-tooth',
  to: '/navigation/vertical-navigation',
}]
</script>

<template>
  <div>
    <USlideover v-model="globalStore.drawer" prevent-close side="left">
      <UCard class="flex flex-col flex-2" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-90">
              AI Flow Mapper
            </h3>
            <UButton variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="globalStore.toggleDrawer" />
          </div>
        </template>
        <UVerticalNavigation :links="links" />
      </UCard>
    </USlideover>
  </div>
</template>
