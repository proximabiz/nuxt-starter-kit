<script setup lang="ts">
import card from '@/assets/media/credit-card.png'
import visa from '@/assets/media/visa.png'
import mastercard from '@/assets/media/mastercard.png'
import { useBillingStore } from '~/stores/billing'

interface Props {
  planName: string,
  duePrice:string
}
const state = useBillingStore();
const props = defineProps<Props>()

</script>

<template>
  <div class="bg-slate-100 p-4 rounded-md mt-3 min-width">
    <p class="font-medium text-xl">
      AI Flow maper {{ props.planName }}
    </p>
    <p class="font-bold text-3xl">
      {{ props.duePrice }}
    </p>
    <p>Billed annually. 18% tax included</p>
  </div>
  <UCard class="mb-6 mt-6">
    <div class="flex gap-3 items-center">
      <img :src="card" alt="" class="w-8">
      <span class="font-medium">Pay with card</span>
      <div class="flex gap-3 ml-auto items-center">
        <img :src="visa" alt="" class="">
        <img :src="mastercard" alt="" class="w-14">
      </div>
    </div>

    <UForm :state="state" class="space-y-2">
      <UFormGroup label="Card holder name" name="cardHolderName" required>
        <UInput v-model="state.cardHolderName" placeholder="Card holder name" />
      </UFormGroup>
      <UFormGroup label="Card no" name="cardNo" required>
        <UInput v-model="state.cardNo" placeholder="**** **** ****" />
      </UFormGroup>
      <div class="flex gap-2">
        <UFormGroup label="Expire date" name="expDate" required>
          <UInput v-model="state.expDate" placeholder="MM/YY" />
        </UFormGroup>
        <UFormGroup label="CVV" name="cvv" required>
          <UInput v-model="state.cvv" placeholder="****" />
        </UFormGroup>
      </div>
    </UForm>
  </UCard>
</template>

<style scoped>
.min-width {
  min-width: 25.5rem;
}
</style>
