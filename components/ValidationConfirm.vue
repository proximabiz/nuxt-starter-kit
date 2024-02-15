<script lang="ts" setup>
interface Props {
 confirmation:{isModalVisible:boolean,context:string}
}
const props = defineProps<Props>()
 const emit = defineEmits(['closeModal']);

function handleClick() {
emit('closeModal');
}
</script>

<template>
  <UModal :model-value="props.confirmation.isModalVisible" :transition="false">
    <div class="p-8">
      <div class="mb-8">
       {{ props.confirmation.context }}
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class=""  @click="handleClick">
        OK
        </UButton>       
      </div>
    </div>
  </UModal>
</template>
