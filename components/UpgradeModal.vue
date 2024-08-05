<!-- <script lang="ts" setup>
interface Props {
  isOpen: boolean
}
interface Emit {
  (e: 'update:isOpen', value: boolean): void

}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const showModal = ref(props.isOpen)

function upgradePlan() {
  showModal.value = false
  emit('update:isOpen', false)
  navigateTo('/website/pricing')
}
</script>

<template>
  <UModal :model-value="props.isOpen" :transition="false">
    <div class="p-8">
      <div class="mb-8">
        Your plan has expired!
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="gray" @click="upgradePlan">
          Upgrade
        </UButton>
      </div>
    </div>
  </UModal>
</template> -->

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'

interface Props {
  modelValue: boolean
  onSubmitConfirm: () => void
  text: string
  ok: string
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'upgrade'])

const combinedText = ref(props.text.includes('To continue') ? props.text.split('\\n') : props.text)

function upgradePlan() {
  props.onSubmitConfirm()
  emits('upgrade')
}

const showUpgradeModal = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    showUpgradeModal.value = newValue
  },
)
</script>

<template>
  <UModal :model-value="modelValue" :transition="false">
    <div class="p-8">
      <div v-if="combinedText[1] !== ''" class="mb-8">
        <p>
          {{ combinedText[0] }}
        </p>
        <p>
          {{ combinedText[1] }}
        </p>
      </div>
      <div v-else>
        {{ combinedText }}
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <UButton color="blue" @click="upgradePlan">
          {{ props.ok ? props.ok : "Confirm" }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>
