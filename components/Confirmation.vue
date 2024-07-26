<script lang="ts" setup>
interface Props {
  isOpen: boolean
  onDeleteConfirm: () => void
  text: string
  leftButton: string
  rightButton: string
}
interface Emit {
  (e: 'update:isOpen', value: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

function confirmDeletion() {
  props.onDeleteConfirm()
  emit('update:isOpen', false)
}
function cancel() {
  emit('update:isOpen', false)
}
</script>
<template>
  <UModal :model-value="props.isOpen" :transition="false">
    <div class="p-8">
      <div class="mb-8">
        {{ props.text }}  
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="blue" @click="cancel">
          {{ props.leftButton }}
        </UButton>
        <UButton color="gray" @click="confirmDeletion">
          {{ props.rightButton }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>