<script setup lang="ts">
const year = ref(2024)

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
}, { key: 'invoice', label: 'Invoice' }]

const payments = [
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$8',
    status: 'Success',
    invoice: 'https://www.proximabiz.com/',
  },
]

const subscriptionStore = useSubscriptionStore()
const cardDetails = computed(() => subscriptionStore.billingDetails)

cardDetails.value.cardHolderName = 'Ipsita'
cardDetails.value.cardNo = 5267437907533201
cardDetails.value.expDate = '05/28'
cardDetails.value.cvv = 6635

const page = ref(1)
const pageCount = 5

const rows = computed(() => {
  return payments.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const years = [
  2024,
]
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
  <div class="ml-4">
    <p class="font-bold text-2xl">
      Your billing history
    </p>
    <hr class="mt-2">
    <section class="grid place-items-center">
      <USelect v-model="year" :options="years" option-attribute="name" class="mt-4" color="blue" />
      <!-- <UTable :columns="columns" :rows="rows">
      <template #invoice="{ row }">
        <a :href="row.invoice" target="_blank">View Invoice</a>
      </template>
    </UTable> -->
      <table class="min-w-full divide-y divide-gray-200 mt-4 border border-gray-200 rounded-sm">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key" class="px-6 py-3 text-left text-xs font-medium  text-gray-900 uppercase tracking-wider">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 ">
          <tr v-for="payment in rows" :key="payment.payment" class="hover:bg-gray-100">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
              {{ payment.payment }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ payment.plan }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ payment.amount }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ payment.status }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :src="payment.invoice" target="_blank" class="text-custom1-500 hover:text-custom1-900 underline">
                View Invoice
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="payments.length" />
      </div>
    </section>
  </div>
</template>
