<script setup lang="ts">
import { z } from 'zod'
import card from '@/assets/media/credit-card.png'
import mastercard from '@/assets/media/mastercard.png'
import visa from '@/assets/media/visa.png'

interface Props {
  planName: string
  duePrice: string
}
const props = defineProps<Props>()
const subscriptionStore = useSubscriptionStore()

const { $error } = useNuxtApp()
const cardDetails = computed(() => subscriptionStore.billingDetails)
const isEditable = ref(false)

const basicExpDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/
const masterCardRegex = /^(?:5[1-5][0-9]{14})$/
const visaCardRegex = /^(?:4[0-9]{12})(?:[0-9]{3})?$/

let { cardHolderName, cardNo, expDate, cvv } = cardDetails.value

if (cardHolderName !== ''
  && cardNo !== ''
  && expDate !== ''
  && cvv !== '')
  isEditable.value = true
else
  isEditable.value = false

const billingSchema = z.object({
  cardHolderName: z.string().min(1, 'Card holder name is required'),
  cardNo: z.string()
    .min(1, 'Card number is required')
    .regex(/^\d+$/, 'Card number must be numeric')
    .refine(val => masterCardRegex.test(val) || visaCardRegex.test(val), {
      message: 'Invalid card number. Please enter a valid card number with 16 digits.',
    }),
  expDate: z.string()
    .regex(basicExpDateRegex, 'Invalid expiration date format')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number)
      const currentYear = new Date().getFullYear() // Get current year
      const currentMonth = new Date().getMonth() + 1 // Get current month (1-12)
      // Check if the year is valid (current year or later) and month is within 1-12
      return (
        year >= currentYear && (year > currentYear || month >= currentMonth)
      )
    }, 'Expiration date must be in the future'),
  cvv: z.string()
    .length(4, 'Security code must be 3 or 4 digits long') // Default message for general case
    .refine(securityCode => /^\d+$/.test(securityCode), 'Security code must only contain digits'),
})

async function getCardDetails() {
  try {
    const response = await subscriptionStore.getCardDetailsAPI()
    const expiryDate = response?.msg !== 'no data' ? `${response?.expiryMonth}/${response?.expiryYear}` : ''
    if (response?.msg !== 'no data') {
      cardHolderName = response?.cardHolderName
      cardNo = response?.cardNumber
      expDate = expiryDate !== undefined ? expiryDate : ''
      cvv = response?.cardNumber && '****'
      isEditable.value = true
    }
    else {
      isEditable.value = false
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

onMounted(async () => {
  await getCardDetails()
})
</script>

<template>
  <div class="bg-slate-100 p-4 rounded-md mt-3 min-width">
    <p class="font-medium text-xl">
      AI FlowMapper {{ props.planName }}
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

    <UForm :schema="billingSchema" :state="cardDetails" class="space-y-2">
      <UFormGroup label="Name on the card" name="cardHolderName">
        <UInput v-model="cardDetails.cardHolderName" placeholder="Name on the card" :disabled="isEditable" />
      </UFormGroup>
      <UFormGroup label="Credit or debit card number" name="cardNo">
        <UInput v-model="cardDetails.cardNo" placeholder="**** **** ****" :disabled="isEditable" />
      </UFormGroup>
      <div class="flex flex-col md:flex-row md:gap-2">
        <UFormGroup label="Expire date" name="expDate" class="flex-grow">
          <UInput v-model="cardDetails.expDate" placeholder="MM/YYYY" :disabled="isEditable" />
        </UFormGroup>
        <UFormGroup label="Security code" name="cvv" class="flex-grow">
          <UInput v-model="cardDetails.cvv" placeholder="****" :disabled="isEditable" />
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
