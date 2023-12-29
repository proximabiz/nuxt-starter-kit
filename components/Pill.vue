<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

interface Props {
  text: string
  link?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <span
      class="inline-flex items-center text-sm px-2 py-1 bg-primary-50 dark:bg-opacity-10 text-primary-500 dark:text-primary-400 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25 hover:bg-primary-100 dark:bg-primary-950/100 dark:hover:bg-primary-900 transition-color relative font-medium rounded-full shadow-none"
    ><a
      :href="props.link"
      rel="noopener noreferrer" target="_blank"
      class="focus:outline-none" tabindex="-1"
    ><span class="absolute inset-0" aria-hidden="true" /></a><span
      class="flex items-center gap-1"
    > {{ text }} </span></span>
  </div>
</template>
