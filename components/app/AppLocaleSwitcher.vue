import type { logger } from '~/utility/logger';
<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n()

watch(locale, (newVal) => {
  setLocale(newVal)
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <USelect v-model="locale" :options="locales" option-attribute="name" value-attribute="code" />
  </div>
</template>
