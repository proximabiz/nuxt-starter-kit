<script setup lang="ts">
import card from '@/assets/media/credit-card.png'
import visa from '@/assets/media/visa.png'
import mastercard from '@/assets/media/mastercard.png'
import { useBillingStore } from '~/stores/billing'
import { z } from 'zod';


interface Props {
  planName: string,
  duePrice:string
}
const state = useBillingStore();
const props = defineProps<Props>()
const basicExpDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

const masterCardRegex = /^(?:5[1-5][0-9]{14})$/;
const visaCardRegex = /^(?:4[0-9]{12})(?:[0-9]{3})?$/;
const americanExpCardRegex = /^(?:3[47][0-9]{13})$/;

const billingSchema = z.object({
  cardHolderName: z.string().min(1, 'Card holder name is required'),
  cardNo: z.string()
    .min(1, 'Card number is required')
    .regex(/^\d+$/, 'Card number must be numeric')
    .refine((val) => masterCardRegex.test(val) || visaCardRegex.test(val) || americanExpCardRegex.test(val), {
      message: 'Invalid card number. Please enter a valid Visa, MasterCard, or American Express card number.',
    }),
 expDate: z.string()
    .regex(basicExpDateRegex, 'Invalid expiration date format')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
      const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
      // Check if the year is valid (current year or later) and month is within 1-12
      return (
        year >= currentYear && (year > currentYear || month >= currentMonth)
      );
    }, 'Expiration date must be in the future'),
    cvv: z.number().min(1, 'Security code  is required').max(4,"Security code should less than 5 numbers")
});

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

    <UForm :schema="billingSchema" :state="state" class="space-y-2">
      <UFormGroup label="Name on the card" name="cardHolderName" required>
        <UInput v-model="state.cardHolderName" placeholder="Name on the card" />
      </UFormGroup>
      <UFormGroup label="Credit or debit card number" name="cardNo" required>
        <UInput v-model="state.cardNo" placeholder="**** **** ****" />
      </UFormGroup>
      <div class="flex gap-2">
        <UFormGroup label="Expiration date" name="expDate" required>
          <UInput v-model="state.expDate" placeholder="MM/YY" />
        </UFormGroup>
        <UFormGroup label="Security code" name="cvv" required>
          <UInput v-model="state.cvv" placeholder="****" type="number"/>
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
