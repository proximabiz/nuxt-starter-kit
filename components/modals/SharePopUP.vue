<script lang="ts" setup>
const isSharePopUpOpen = true
</script>

<template>
  <UModal :model-value="isSharePopUpOpen" :transition="false">
    <div class="p-8">
      <div class="mb-8" />
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="blue">
          Cancel
        </UButton>
        <UButton class="">
          Done
        </UButton>
      </div>
    </div>
  </UModal>
</template>
