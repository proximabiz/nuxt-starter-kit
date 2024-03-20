<script setup lang="ts">
/** Types */
interface Icon {
  name: string
  color: string
}

interface Props {
  icon: Icon
  message: string
  modelValue: boolean
  confirmButtonLabel: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'onConfirm'): void
}

/** Constants */
const props = withDefaults(defineProps<Props>(), {
  icon: () => {
    return {
      name: 'i-heroicons-check-circle',
      color: 'green',
    }
  },
  message: 'Event has been executed successfully',
  confirmButtonLabel: 'Okay, got it',
})
const emit = defineEmits<Emits>()

/** Methods */
function onDialogClose() {
  emit('onConfirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <div>
    <UModal :model-value="props.modelValue" prevent-close @update:model-value="onDialogClose">
      <div class="flex items-end justify-end">
        <UIcon name="i-heroicons-x-mark" class="size-10 text-gray-500 pt-4 pe-4 cursor-pointer" @click="onDialogClose()" />
      </div>
      <div class="flex items-center justify-center px-10">
        <div class="w-full bg-white rounded-3xl">
          <div class="mt-10 flex justify-center mb-5 ">
            <UIcon :name="props.icon.name" class="w-12 h-12 text-2xl" :class="[`text-${props.icon.color}-400`]" />
          </div>
          <div class="flex justify-center px-5 ">
            <div class="border-b-2 border-gray-500 w-full" />
          </div>
          <div class="flex justify-center text-center p-5">
            <p v-html="message" />
          </div>
          <div class="flex justify-center text-center p-5 mb-5">
            <UButton block @click="onDialogClose()">
              {{ confirmButtonLabel }}
            </UButton>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
