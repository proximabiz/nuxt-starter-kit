<script setup lang="ts">
import { z } from 'zod'

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
const isEditable = ref(false)
const isModalVisible = ref(false)
const { $success } = useNuxtApp()
const isSavePopupOpen = ref(false)
const isIgnoredCardDetails = ref(false)
const toRoute = ref()
const router = useRouter()
if (cardDetails.value.cardHolderName !== ''
  || cardDetails.value.cardNo !== ''
  || cardDetails.value.expDate !== ''
  || cardDetails.value.cvv !== '')
  isEditable.value = true
const basicExpDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
const masterCardRegex = /^(?:5[1-5][0-9]{14})$/
const visaCardRegex = /^(?:4[0-9]{12})(?:[0-9]{3})?$/
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
      const currentYear = new Date().getFullYear() % 100 // Get last two digits of the current year
      const currentMonth = new Date().getMonth() + 1 // Get current month (1-12)
      // Check if the year is valid (current year or later) and month is within 1-12
      return (
        year >= currentYear && (year > currentYear || month >= currentMonth)
      )
    }, 'Expiration date must be in the future'),
  cvv: z.string()
    .length(4, 'Security code must be 3 or 4 digits long') // Default message for general case
    .refine(cvv => /^\d+$/.test(cvv), 'Security code must only contain digits'),
})
const page = ref(1)
const pageCount = 5
const rows = computed(() => {
  return payments.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
const years = [
  2024,
]
function showModal() {
  isModalVisible.value = true
}
async function handleDeleteConfirm(): Promise<void> {
  cardDetails.value.cardHolderName = ''
  cardDetails.value.cardNo = ''
  cardDetails.value.expDate = ''
  cardDetails.value.cvv = ''
  $success('Your old card details has succussfuly deleted')
  isEditable.value = false
  // try {
  //   const response = await userStore.deleteTaxGst()
  //   if (response?.status === 200) {
  //     // Clear the GST number from state
  //     state.gstNumber = ''
  //     isDisabled.value = false
  //     isModalVisible.value = false
  //     $success(response.message)
  //   }
  // }
  // catch (error) {
  //   $error(error.statusMessage)
  // }
}
function handleSubmit() {
  $success('Your new card details has succussfuly added')
  if (cardDetails.value.cardHolderName !== ''
    || cardDetails.value.cardNo !== ''
    || cardDetails.value.expDate !== ''
    || cardDetails.value.cvv !== '')
    isEditable.value = true
}
async function onCancel() {
  cardDetails.value.cardHolderName = ''
  cardDetails.value.cardNo = ''
  cardDetails.value.expDate = ''
  cardDetails.value.cvv = ''
  isEditable.value = false
}
function navigateTo(path: string) {
  router.push(path)
}
function saveDetails(_valid: boolean) {
  isSavePopupOpen.value = false
  isIgnoredCardDetails.value = true
  if (_valid)
    navigateTo(toRoute.value)
}
onBeforeRouteLeave((to, from, next) => {
  if (cardDetails.value.cardNo === '' && !isIgnoredCardDetails.value) {
    return (
      isSavePopupOpen.value = true,
      toRoute.value = to.path)
  }
  else {
    next()
  }
})
</script>

<template>
  <ProfileBreadCrumb text="Billing & Payments" />
  <p class="font-bold text-2xl ml-4 mt-4">
    Your saved credit and debit cards
  </p>
  <hr class="ml-4 mt-2">
  <section class="grid place-items-center p-4">
    <div class="relative mb-6 mt-6 w-full max-w-lg">
      <UCard>
        <UForm :schema="billingSchema" :state="cardDetails" class="space-y-2">
          <UFormGroup label="Name on the card" name="cardHolderName">
            <UInput v-model="cardDetails.cardHolderName" placeholder="Name on the card" :disabled="isEditable" />
          </UFormGroup>
          <UFormGroup label="Credit or debit card number" name="cardNo">
            <UInput v-model="cardDetails.cardNo" placeholder="**** **** ****" :disabled="isEditable" />
          </UFormGroup>
          <div class="flex flex-col md:flex-row md:gap-2">
            <UFormGroup label="Expire date" name="expDate" class="flex-grow">
              <UInput v-model="cardDetails.expDate" placeholder="MM/YY" :disabled="isEditable" />
            </UFormGroup>
            <UFormGroup label="Security code" name="cvv" class="flex-grow">
              <UInput v-model="cardDetails.cvv" placeholder="****" :disabled="isEditable" />
            </UFormGroup>
          </div>
        </UForm>
      </UCard>
      <div v-if="isEditable" class="absolute bottom-[1rem] right-[-3rem]">
        <UTooltip text="Delete the old card details to add new one." :popper="{ arrow: true }">
          <UButton color="red" icon="i-heroicons-trash" size="sm" variant="ghost" @click="showModal" />
        </UTooltip>
      </div>
    </div>
    <div v-if="!isEditable" class="flex gap-2 justify-center">
      <UButton color="blue" @click="onCancel">
        Cancel
      </UButton>
      <UButton color="blue" @click="handleSubmit">
        Save
      </UButton>
    </div>
    <Confirmation
      v-model="isModalVisible"
      :is-open="isModalVisible"
      text="Are you sure! you want to delete this Card details?"
      left-button="Cancel"
      right-button="Delete"
      @update:is-open="isModalVisible = $event"
      @delete-confirm="handleDeleteConfirm"
    />
  </section>
  <div class="ml-4">
    <p class="font-bold text-2xl mt-4">
      Your billing history
    </p>
    <hr class="mt-2">
    <section class="grid place-items-center p-4">
      <div class="w-full max-w-xs">
        <USelect v-model="year" :options="years" option-attribute="name" class="mt-4 w-full" color="blue" />
      </div>
      <div class="overflow-x-auto w-full mt-4">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-sm">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns" :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
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
                <NuxtLink
                  :src="payment.invoice" target="_blank"
                  class="text-custom1-500 hover:text-custom1-900 underline"
                >
                  View Invoice
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 w-full">
        <UPagination v-model="page" :page-count="pageCount" :total="payments.length" />
      </div>
    </section>
  </div>
  <Confirmation
    v-model="isSavePopupOpen"
    :is-open="isSavePopupOpen"
    text="Please add card details."
    left-button="Ok"
    right-button="Add Later"
    @update:is-open="isSavePopupOpen = $event"
    @delete-confirm="saveDetails(true)"
  />
</template>
