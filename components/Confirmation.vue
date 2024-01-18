<script lang="ts" setup>
  import { ref } from 'vue';
  const isOpen = ref(false)

  const confirmDeletion=()=> {
    isOpen.value=false 
  }
  const cancel=()=> {
 isOpen.value=false
  }
  </script>


<template>
   <UModal v-model="isOpen" :transition="false">
      <div class="p-8"> 
        <div class="mb-8">Are you sure you want to delete this Tax ID/GST No?</div>
        <div class="mt-4 flex justify-end gap-4">
          <UButton @click="cancel" class="" color="blue">
            Cancel
          </UButton>
          <UButton @click="confirmDeletion" class="" color="gray">
            Delete
          </UButton>
        </div>
      </div>
    </UModal>
  </template>
  