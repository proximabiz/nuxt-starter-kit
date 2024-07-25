<script lang="ts" setup>
interface Props {
  breadcrumbText: string
}
const props = defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="ml-4">
    <div class="flex font-semibold text-sm">
      <NuxtLink to="/profile/account">
        <span class="cursor-pointer">
          My Account
        </span>
      </NuxtLink>
      <span class="mx-1">
        >
      </span>
      <span class="text-custom4-600">
        {{ props.breadcrumbText }}
      </span>
    </div>
  </nav>
</template>
