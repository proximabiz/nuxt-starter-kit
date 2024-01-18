<script lang="ts" setup>
interface Props {
  isOpen: boolean
  onDeleteConfirm: () => void
}
interface Emit {
  (e: 'update:isOpen', value: boolean): void

}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const isOpen = ref(false)

const confirmDeletion=()=> {
  props.onDeleteConfirm()
  emit('update:isOpen', false)
}
const cancel=()=> {
  emit('update:isOpen', false)
}
</script>

<template>
  <UModal :model-value="isOpen" :transition="false">
    <div class="p-8">
      <div class="mb-8">
        Are you sure you want to delete this Tax ID/GST No?
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="blue" @click="cancel">
          Cancel
        </UButton>
        <UButton class="" color="gray" @click="confirmDeletion">
          Delete
        </UButton>
      </div>
    </div>
  </UModal>
</template>
