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
}]
const payments = [
  {
    payment: '21/2/2024',
    plan: 'Premium',
    amount: '$8',
    status: 'Success',
    // invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$4',
    status: 'Success',
    // invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Premium',
    amount: '$8',
    status: 'Success',
    // invoice: 'https://www.proximabiz.com/',
  },
  {
    payment: '21/2/2024',
    plan: 'Basic',
    amount: '$4',
    status: 'Success',
    // invoice: 'https://www.proximabiz.com/',
  },
]
const subscriptionStore = useSubscriptionStore()
const diagramStore = useDiagramStore()
const cardDetails = computed(() => subscriptionStore.billingDetails)
const diagramsList = computed(() => diagramStore.diagramsList)
const isEditDisable = ref<boolean>(false)
const confirmationModal = ref<boolean>(false)
const isFieldEmtpy = ref<boolean>(true)

const isLoadingFetch = ref<boolean>(false)
const isLoadingDelete = ref<boolean>(false)
const isLoadingAdd = ref<boolean>(false)
const cardData = ref({
  cardHolderName: '',
  cardNo: '',
  expDate: '',
  cvv: '',
})

const { $success, $error } = useNuxtApp()
const { cardHolderName, cardNo, expDate, cvv } = cardData.value

if (cardHolderName !== ''
  && cardNo !== ''
  && expDate !== ''
  && cvv !== '') {
  isEditDisable.value = true
  isFieldEmtpy.value = false
}

const basicExpDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/
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
const page = ref(1)
const pageCount = 5
const rows = computed(() => {
  return payments.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
const years = [
  2024,
  2025,
]
function showModal() {
  confirmationModal.value = true
}
async function handleDeleteConfirm(): Promise<void> {
  try {
    isLoadingDelete.value = true
    const response = await subscriptionStore.deleteCardDetails()

    if (response) {
      isLoadingDelete.value = false
      cardData.value.cardHolderName = ''
      cardData.value.cardNo = ''
      cardData.value.expDate = ''
      cardData.value.cvv = ''

      cardDetails.value.cardHolderName = ''
      cardDetails.value.cardNo = ''
      cardDetails.value.expDate = ''
      cardDetails.value.cvv = ''
      isEditDisable.value = false
      isFieldEmtpy.value = true
      $success('Your old card details has succussfuly deleted')
    }
  }
  catch (error) {
    $error(error)
  }
}

async function getCardDetails() {
  isLoadingFetch.value = true
  try {
    const response = await subscriptionStore.getCardDetailsAPI()
    const expiryDate = response?.msg !== 'no data' ? `${response?.expiryMonth}/${response?.expiryYear}` : ''
    if (response?.msg !== 'no data') {
      isLoadingFetch.value = false
      cardData.value.cardHolderName = response?.cardHolderName
      cardData.value.cardNo = response?.cardNumber
      cardData.value.expDate = expiryDate !== undefined ? expiryDate : ''
      cardData.value.cvv = response?.cardNumber && '****'

      cardDetails.value.cardHolderName = response?.cardHolderName
      cardDetails.value.cardNo = response?.cardNumber
      cardDetails.value.expDate = expiryDate !== undefined ? expiryDate : ''
      cardDetails.value.cvv = response?.cardNumber && '****'

      isEditDisable.value = true
    }
    else {
      isLoadingFetch.value = false
      isEditDisable.value = false
      cardDetails.value.cardHolderName = ''
      cardDetails.value.cardNo = ''
      cardDetails.value.expDate = ''
      cardDetails.value.cvv = ''
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

async function handleSubmit() {
  try {
    const { cardHolderName, cardNo, expDate, cvv } = cardData.value

    isLoadingAdd.value = true
    const monthYear = expDate.split('/')
    const payload = {
      cardHolderName,
      cardNumber: cardNo.toString(),
      expiryMonth: Number(monthYear[0]),
      expiryYear: Number(monthYear[1]),
      securityCode: cvv.toString(),
    }
    const response = await subscriptionStore.addNewCardDetails(payload)
    if (cardHolderName !== ''
      || cardNo !== ''
      || expDate !== ''
      || cvv !== ''
      || response) {
      return (
        $success('Your new card details has succussfuly added'),
        isLoadingAdd.value = false,
        isEditDisable.value = true,
        isFieldEmtpy.value = false,
        await getCardDetails()
      )
    }
    else {
      isLoadingAdd.value = false
      $error('Card details are should not be empty')
    }
  }
  catch (error) {
    $error(error.statusMessage)
    isLoadingAdd.value = false
  }
}

onMounted(async () => {
  await getCardDetails()
})

watch([cardDetails.value, cardData.value, isFieldEmtpy.value, diagramsList.value?.length], () => {
  const { cardHolderName, cardNo, expDate, cvv } = cardData.value

  if (cardHolderName !== ''
    && cardNo !== ''
    && expDate !== ''
    && cvv !== '') { isFieldEmtpy.value = false }
  else {
    isFieldEmtpy.value = true
    isEditDisable.value = false
  }
}, { deep: true, immediate: true })

async function onCancel() {
  cardData.value.cardHolderName = ''
  cardData.value.cardNo = ''
  cardData.value.expDate = ''
  cardData.value.cvv = ''
  isEditDisable.value = false
  isFieldEmtpy.value = true
}
</script>

<template>
  <ProfileBreadCrumb text="Billing & Payments" />
  <p class="font-bold text-2xl ml-4 mt-4">
    Your saved credit and debit cards
  </p>
  <hr class="ml-4 mt-2">
  <section class="grid place-items-center p-4">
    <div class="relative mb-6 mt-6 w-full max-w-lg">
      <UModal v-model="isLoadingFetch">
        <UProgress animation="carousel" />
        <UCard>
          Fetching your <span class="font-bold">Card details.</span>
        </UCard>
      </UModal>
      <UModal v-model="isLoadingDelete">
        <UProgress animation="carousel" />
        <UCard>
          Deleting your <span class="font-bold">Card details.</span>
        </UCard>
      </UModal>
      <UModal v-model="isLoadingAdd">
        <UProgress animation="carousel" />
        <UCard>
          Adding your <span class="font-bold">Card details.</span>
        </UCard>
      </UModal>
      <UCard>
        <UForm :schema="billingSchema" :state="cardData" class="space-y-2">
          <UFormGroup label="Name on the card" name="cardHolderName">
            <UInput v-model="cardData.cardHolderName" placeholder="Name on the card" :disabled="isEditDisable" />
          </UFormGroup>
          <UFormGroup label="Credit or debit card number" name="cardNo">
            <UInput v-model="cardData.cardNo" placeholder="**** **** ****" :disabled="isEditDisable" />
          </UFormGroup>
          <div class="flex flex-col md:flex-row md:gap-2">
            <UFormGroup label="Expire date" name="expDate" class="flex-grow">
              <UInput v-model="cardData.expDate" placeholder="MM/YYYY" :disabled="isEditDisable" />
            </UFormGroup>
            <UFormGroup label="Security code" name="cvv" class="flex-grow">
              <UInput v-model="cardData.cvv" placeholder="****" :disabled="isEditDisable" />
            </UFormGroup>
          </div>
        </UForm>
      </UCard>
      <div v-if="isEditDisable" class="absolute bottom-[1rem] right-[-3rem]">
        <UTooltip text="Delete the old card details to add new one." :popper="{ arrow: true }">
          <UButton color="red" icon="i-heroicons-trash" size="sm" variant="ghost" @click="showModal" />
        </UTooltip>
      </div>
    </div>
    <div v-if="!isEditDisable" class="flex gap-2 justify-center">
      <UButton color="blue" @click="onCancel">
        Cancel
      </UButton>
      <UButton color="blue" :disabled="isFieldEmtpy" @click="handleSubmit">
        Save
      </UButton>
    </div>
    <Confirmation
      v-model="confirmationModal"
      :is-open="confirmationModal"
      text="Are you sure! you want to delete this Card details?"
      left-button="Cancel"
      right-button="Delete"
      @update:is-open="confirmationModal = $event"
      @delete-confirm="handleDeleteConfirm"
    />
  </section>
  <div class="ml-4">
    <p class="font-bold text-2xl mt-4">
      Your billing history
    </p>
    <hr class="mt-2">
    <section class="grid place-items-center p-4">
      <div class=" max-w-xs">
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
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 w-full">
        <UPagination v-model="page" :page-count="pageCount" :total="payments.length" />
      </div>
    </section>
  </div>
</template>
