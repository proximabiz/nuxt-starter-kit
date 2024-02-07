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
</script>

<template>
  <section class="grid place-items-center mt-6 gap-3">
    <div class="bg-slate-100 p-4 min-w-96">
      <p class="font-medium text-xl">
        AI Flow maper Pro
      </p>
      <p class="font-bold text-3xl">
        77.08$
      </p>
      <p>Billed annually. 18% tax included</p>
    </div>
    <div class="bg-slate-100 p-4 min-w-96">
      <p>Ipsita</p>
      <p>74569 Bangalore</p>
      <p>India</p>
    </div>
    <!-- <div class="font-bold">
      Enter payment details
    </div> -->
    <!-- <USelectMenu v-model="selected" :options="people">
      <template #leading>
        <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4 mx-0.5" />
        <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" size="3xs" class="mx-0.5" />
      </template>
    </USelectMenu> -->
    <UButton class="mt-4">
      Complete order
    </UButton>
  </section>
</template>

<style scoped>

</style>
