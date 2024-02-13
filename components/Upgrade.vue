<script lang="ts" setup>
interface Props {
  isOpen: boolean
}
interface Emit {
  (e: 'update:isOpen', value: boolean): void

}
const props = defineProps<Props>()
const emit = defineEmits<Emit>();
const showModal=ref(true)

function upgradePlan() { 
    showModal.value=false
  emit('update:isOpen', false)
  navigateTo("/website/pricing")
}
</script>

<template>
  <UModal :model-value="props.isOpen && showModal" :transition="false">
    <div class="p-8">
      <div class="mb-8">
       Your plan has exparied!...
      </div>
      <div class="mt-4 flex justify-end gap-4">        
        <UButton class="" color="gray" @click="upgradePlan">
        Upgrade
        </UButton>
      </div>
    </div>
  </UModal>
</template>
