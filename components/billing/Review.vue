<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'

interface Props {
  planName: string
  duePrice: string
}
const props = defineProps<Props>()
const state = useBillingStore()
</script>

<template>
  <section class="grid place-items-center mt-6 gap-3">
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Plan Details:
      </div>
      <div>
        <p class="font-medium text-xl">
          AI Flow maper {{ props.planName }}
        </p>
        <p class="font-bold text-3xl">
          {{ props.duePrice }}
        </p>
        <p>Billed annually. 18% tax included</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Address Details:
      </div>
      <div>
        <p>{{ state.name }}</p>
        <p>{{ state.city }} {{ state.zip }}</p>
        <p>{{ state.country }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Card Details:
      </div>
      <div>
        <p>Name on the card: {{ state.cardHolderName }}</p>
        <p>Credit or debit card number: {{ state.cardNo }}</p>
        <p>Expire date: {{ state.expDate }}</p>
        <p>Security code: {{ state.cvv }}</p>
      </div>
    </div>
    <!-- <div class="font-bold">
      Enter payment details
    </div> -->
    <!-- <USelectMenu v-model="selected" :options="people">
      <template #leading>
        <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4 mx-0.5" />
        <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" size="3xs" class="mx-0.5" />
      </template>
    </USelectMenu> -->
    <UButton class="mt-4">
      Complete order
    </UButton>
  </section>
</template>

<style scoped>
.min-width {
  min-width: 30rem;
  max-width: 30rem;
}
</style>
