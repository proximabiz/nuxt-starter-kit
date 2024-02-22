<script setup lang="ts">
import { useBillingStore } from '~/stores/subscription'

const columns = [{
  key: 'payment',
  label: 'Payment Date',
}, {
  key: 'plan',
  label: 'Plan',
}, {
  key: 'amount',
  label: 'Amount',
}, {
  key: 'status',
  label: 'Status',
}, { key: 'invoice', label: 'Invoice',
}]

const payments = [
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'View Invoice',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'View Invoice',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'View Invoice',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'View Invoice',
  },
]

const billingStore = useBillingStore()
const cardDetails = computed(() => billingStore.GET_ADDRESS_AND_CARD_DETAILS)

cardDetails.value.cardHolderName = 'Ipsita'
cardDetails.value.cardNo = '5267437907533201'
cardDetails.value.expDate = '05/28'
cardDetails.value.cvv = '6635'

const page = ref(1)
const pageCount = 5

const rows = computed(() => {
  return payments.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
</script>

<template>
  <p class="font-bold text-2xl ml-4">
    Your saved credit and debit cards
  </p>
  <hr class="ml-4 mt-2">
  <section class="grid place-items-center">
    <UCard class="mb-6 mt-6">
      <UForm schema="" :state="cardDetails" class="space-y-2">
        <UFormGroup label="Name on the card" name="cardHolderName">
          <UInput v-model="cardDetails.cardHolderName" placeholder="Name on the card" disabled />
        </UFormGroup>
        <UFormGroup label="Credit or debit card number" name="cardNo">
          <UInput v-model="cardDetails.cardNo" placeholder="**** **** ****" disabled />
        </UFormGroup>
        <div class="flex gap-2">
          <UFormGroup label="Expire date" name="expDate">
            <UInput v-model="cardDetails.expDate" placeholder="MM/YY" disabled />
          </UFormGroup>
          <UFormGroup label="Security code" name="cvv">
            <UInput v-model="cardDetails.cvv" placeholder="****" disabled />
          </UFormGroup>
        </div>
      </UForm>
    </UCard>
  </section>
  <p class="font-bold text-2xl ml-4">
    Your billing history
  </p>
  <hr class="ml-4 mt-2">
  <section class="grid place-items-center">
    <UTable :columns="columns" :rows="rows">
      <template #invoice="{ row }">
        <a :href="row.invoice" target="_blank">View Invoice</a>
      </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="payments.length" />
    </div>
  </section>
</template>
