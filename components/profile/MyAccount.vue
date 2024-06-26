<script setup lang="ts">
import card from '@/assets/media/bill.png'
import address from '@/assets/media/building.png'
import plan from '@/assets/media/planning.png'
import tax from '@/assets/media/tax.png'

// Refs
const selectedComponent = ref()
const subscriptionStore = useSubscriptionStore()

const sub_status = computed(() => subscriptionStore.subscriptionStatus)

const cards = [
  { id: 1, text: 'Address, Contact Details', iconSrc: address, componentName: 'ProfileAddressDetails', isDisabled: false },
  { id: 2, text: 'Tax ID / GST Details', iconSrc: tax, componentName: 'ProfileGstAndTax', isDisabled: false },
  { id: 3, text: 'Billing & Payments', iconSrc: card, componentName: '', isDisabled: sub_status.value.planName === 'Free' },
  { id: 4, text: 'My Plan', iconSrc: plan, componentName: 'ProfileMyPlan', isDisabled: false },
]

async function setComponentName(componentName: string) {
  selectedComponent.value = componentName
}
// Computed property for breadcrumb text
const breadcrumbText = computed(() => {
  const card = cards.find(c => c.componentName === selectedComponent.value)
  return card ? card.text : 'Select a category'
})
function resetComponent() {
  selectedComponent.value = ''
}
</script>

<template>
  <nav v-if="selectedComponent" aria-label="Breadcrumb" class="ml-4">
    <ol class="flex font-semibold">
      <li class="cursor-pointer" @click="resetComponent()">
        My Account
      </li>
      <li class="mx-1">
        >
      </li>
      <li class="text-custom4-600">
        {{ breadcrumbText }}
      </li>
    </ol>
  </nav>
  <div v-if="!selectedComponent" class="grid place-items-center">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 mt-20">
      <UCard
        v-for="item in cards" :key="item.id"
        :class="item.isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-custom1-100 delay-150 cursor-pointer'"
        :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''"
        @click="setComponentName(item.componentName)"
      >
        <div class="flex items-center py-8" :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''">
          <div>
            <img :src="item.iconSrc" class="h-10" alt="">
          </div>
          <div class="text-2xl me-6 font-semibold">
            {{ item.text }}
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <ProfileAddresDetails v-if="selectedComponent === 'ProfileAddressDetails'" />
  <ProfileGstAndTax v-if="selectedComponent === 'ProfileGstAndTax'" />
  <ProfileBillingPayments v-if="selectedComponent === 'BillingPayments'" />
  <ProfileMyPlan v-if="selectedComponent === 'ProfileMyPlan'" />
</template>
