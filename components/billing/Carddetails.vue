<script setup lang="ts">
const people = [{
  id: 'benjamincanac',
  label: 'benjamincanac',
  href: 'https://github.com/benjamincanac',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' },
}, {
  id: 'Atinux',
  label: 'Atinux',
  href: 'https://github.com/Atinux',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' },
}, {
  id: 'smarroufin',
  label: 'smarroufin',
  href: 'https://github.com/smarroufin',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/7547335?v=4' },
}, {
  id: 'nobody',
  label: 'Nobody',
  icon: 'i-heroicons-user-circle',
}]

const selected = ref(people[0])
const links = [{
  label: 'Your plan',
  to: '/billing/monthly-billing',
}, {
  label: 'Your Address',
  to: '/billing/billing-address',
}, {
  label: 'Card Details',
  to: '/billing/card-details',
}]
</script>

<template>
  <section class="grid place-items-center mt-8 gap-3">
    <div class="mb-4">
      <UBreadcrumb :links="links" divider="" :ui="{ ol: 'gap-x-3' }">
        <template #icon="{ link, index, isActive }">
          <UAvatar
            :alt="(index + 1).toString()"
            :ui="{
              background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
              placeholder: isActive ? 'text-white dark:text-gray-900' : !!link.to ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : '',
            }"
            size="xs"
          />
        </template>
      </UBreadcrumb>
    </div>
    <div />
    <div class="bg-slate-200">
      <p>Ipsita</p>
      <p>74569 Bangalore</p>
      <p>India</p>
    </div>
    <div class="font-bold">
      Enter payment details
    </div>
    <USelectMenu v-model="selected" :options="people">
      <template #leading>
        <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4 mx-0.5" />
        <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" size="3xs" class="mx-0.5" />
      </template>
    </USelectMenu>
    <UButton class="mt-4">
      Complete payment
    </UButton>
  </section>
</template>

<style scoped>

</style>
