<script lang="ts" setup>
interface Props {
  isOpen: boolean
  onDeleteConfirm: () => void
  text: string
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
        <!-- Are you sure you want to delete this Tax ID/GST No? -->
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="blue" @click="cancel">
          Cancel
        </UButton>
        <UButton color="gray" @click="confirmDeletion">
          {{ props.text.includes("delete") ? "Delete" : "Confirm" }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>
