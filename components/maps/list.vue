<script></script>

<template>
  <div class="flex">
    <UCard class="w-64 min-h-64 mx-auto inline-flex align-center justify-center items-center bg-blue">
      <UIcon name="i-heroicons-plus" class="text-2xl" />
    </UCard>
    <UCard v-for="i in 4" :key="i" class="w-64 mx-auto">
      <template #header>
        <div class="font-bold">
          Map {{ i }}
        </div>
      </template>

      Some Description or image

      <template #footer>
        <UButton color="blue">
          Start Editing
        </UButton>
      </template>
    </UCard>
  </div>
</template>
