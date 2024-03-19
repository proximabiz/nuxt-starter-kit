<script setup lang="ts">
/** Types */
interface PropTypes {
  email: string
  modelValue: boolean
}

interface EmitTypes {
  (e: 'update:modelValue', value: boolean): void
}

/** Constants */
const props = defineProps<PropTypes>()
const emit = defineEmits<EmitTypes>()

/** Methods */
const onDialogClose = () => emit('update:modelValue', false)
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
            <UIcon name="i-heroicons-envelope-open" class="w-12 h-12" />
          </div>
          <div class="flex justify-center px-5 ">
            <div class="border-b-2 border-gray-500 w-full" />
          </div>
          <div class="flex justify-center text-center p-5">
            <p class="">
              We've sent an email to <b>{{ props.email }}</b> to confirm the validity of your email address. After
              receiving the email follow the link provided to complete your registration.
            </p>
          </div>
          <div class="flex justify-center text-center p-5">
            <UButton @click="onDialogClose()">
              Okay
            </UButton>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
