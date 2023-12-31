<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n()

const languages = computed({
  get() {
    return locale.value
  },
  set(value) {
    setLocale(value)
  },
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <USelect v-model="languages" :options="locales" option-attribute="name" value-attribute="code" />
  </div>
</template>
