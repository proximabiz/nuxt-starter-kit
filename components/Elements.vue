<script setup lang="ts">
import type { Element } from '~/server/api/elements/database'

const { data: elements, execute } = useFetch<Array<Element>>('/api/elements', {
  lazy: false,
})

function shuffleElements() {
  if (elements.value) {
    for (let i = elements.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elements.value[i], elements.value[j]] = [elements.value[j], elements.value[i]]
    }
  }
}

function resetElements() {
  execute()
}
</script>

<template>
  <div>
    <div class="py-6">
      <div class="flex gap-2 justify-start pb-4">
        <UButton icon="lucide:refresh-ccw" variant="outline" size="sm" @click="resetElements()" />
        <UButton icon="lucide:shuffle" variant="outline" size="sm" @click="shuffleElements()" />
      </div>
      <!-- <div v-auto-animate class="flex flex-wrap gap-4">
        <UButton v-for="el in elements" :key="el.number" size="sm" :label="el.symbol" color="gray" variant="solid" class="min-w-12 min-h-12 justify-center hover:shadow-md hover:scale-125" />
      </div> -->
      <div v-auto-animate class="flex flex-wrap gap-2">
        <UTooltip v-for="el in elements" :key="el.number" :shortcuts="[`${el.number}`]">
          <UButton :label="el.symbol" color="gray" variant="solid" class=" min-w-12 min-h-12 justify-center" />

          <template #text>
            <span class="font-medium">{{ el.name }}</span>
          </template>
        </UTooltip>
      </div>
    </div>
  </div>
</template>
