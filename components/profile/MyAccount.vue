<script setup lang="ts">
import address from '@/assets/media/address.png'
import card from '@/assets/media/card.png'
import tax from '@/assets/media/gst.png'
import plan from '@/assets/media/plan.png'
import { useBillingStore } from '~/stores/subscription';

// Refs
const selectedComponent = ref()
const subStatusStore = useBillingStore()

const sub_status = computed(() => subStatusStore.GET_SUB_STATUS)
console.log(sub_status.value.planName)

const cards = [
  { id: 1, text: 'Address, Contact Details', iconSrc: address, componentName: 'ProfileAddressDetails',isDisabled:false },
  { id: 2, text: 'Tax ID / GST Details', iconSrc: tax, componentName: 'ProfileGstAndTax' ,isDisabled:false},
  { id: 3, text: 'Billing & Payments', iconSrc: card, componentName: 'BillingPayments',isDisabled: sub_status.value.planName==='Free'},
  { id: 4, text: 'My Plan', iconSrc: plan, componentName: 'ProfileMyPlan',isDisabled:false },
]

async function setComponentName(componentName: string) {
  selectedComponent.value = componentName
}
// Computed property for breadcrumb text
const breadcrumbText = computed(() => {
  const card = cards.find(c => c.componentName === selectedComponent.value);
  return card ? card.text : 'Select a category';
});
function resetComponent() {
  selectedComponent.value = ''
}
</script>

<template>
  <nav v-if="selectedComponent" aria-label="Breadcrumb" class="ml-4">
  <ol class="flex font-semibold">
    <li class="cursor-pointer" @click="resetComponent()">My Account </li>
    <li class="mx-1"> > </li>
    <li class="text-custom4-600"> {{ breadcrumbText }} </li>
  </ol>
</nav>
  <section v-if="!selectedComponent" class="grid place-items-center">
    <div class="grid grid-cols-2 gap-10 mt-20">
      <UCard
        v-for="item in cards" :key="item.id"
        class="minimum-width sm:min-w-20"
        :class="item.isDisabled ?'cursor-not-allowed opacity-60':'hover:bg-gray-300 delay-150 cursor-pointer'"
        @click="setComponentName(item.componentName)" 
        :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''">
        <div class="flex items-center" :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''">
          <div>
            <img :src="item.iconSrc" class="h-10" alt="">
          </div>
          <div class="text">
            {{ item.text }}
          </div>
        </div>
      </UCard>
    </div>
  </section>

  <ProfileAddresDetails v-if="selectedComponent === 'ProfileAddressDetails'" />
  <ProfileGstAndTax v-if="selectedComponent === 'ProfileGstAndTax'" />
  <ProfileBillingPayments v-if="selectedComponent==='BillingPayments'"/>
  <ProfileMyPlan v-if="selectedComponent === 'ProfileMyPlan'" />
</template>

<style scoped>
.minimum-width {
  min-width: 24rem;
}
</style>
