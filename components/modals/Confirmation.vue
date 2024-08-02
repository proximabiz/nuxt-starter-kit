<script setup lang="ts">
/** ----------- Interfaces/Types ----------- */
interface Action {
  label: string
  color: string
}

interface Emit {
  (e: 'on:cancel'): void
  (e: 'on:confirm'): void
}

/** ----------- Constants ----------- */
const props = defineProps({
  title: {
    type: String,
    default: 'Are you sure?',
  },
  description: {
    type: String,
    default: 'Are you sure to proceed ahead? This action is irreversible and cannot be undone.',
  },
  cancelAction: {
    type: Object as PropType<Action>,
    required: false,
    default() {
      return {
        label: 'Cancel',
        color: 'bg-gray-200',
      }
    },
  },
  confirmAction: {
    type: Object as PropType<Action>,
    required: false,
    default() {
      return {
        label: 'Confirm',
        color: 'bg-green-500',
      }
    },
  },
})
const emit = defineEmits<Emit>()
</script>

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-700 opacity-75" />
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" />
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
      >
        <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <UButton class="bg-white text-gray-500" icon="i-heroicons-x-mark" @click="emit('on:cancel')" />
        </div>
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <UIcon name="i-heroicons-exclamation-circle" class="text-xl cursor-pointer" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ title }}
            </h3>
            <div class="mt-4">
              <p class="text-sm leading-5 text-gray-500">
                {{ description }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-7 flex">
          <UButton
            :class="[props.cancelAction.color]"
            class="mx-1 justify-center grow rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="emit('on:cancel')"
          >
            {{ props.cancelAction.label }}
          </UButton>
          <UButton
            :class="[props.confirmAction.color]"
            class="mx-1 justify-center grow rounded-md border border-transparent px-4 py-2 leading-6 font-medium shadow-sm focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="emit('on:confirm')"
          >
            {{ props.confirmAction.label }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
