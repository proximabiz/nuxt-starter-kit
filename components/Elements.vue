<script setup lang="ts">
const createArray = (n: number) => Array.from({ length: n }, (_, i) => i + 1)
</script>

<template>
  <div v-if="false">
    please wait...
  </div>
  <div v-else>
    <div class="py-6">
      <div class="flex flex-wrap  gap-4">
        <UButton v-for="item in createArray(10)" :key="item" :label="item.toString()" color="gray" class="w-12 h-12 justify-center" />
      </div>
    </div>
  </div>
</template>
