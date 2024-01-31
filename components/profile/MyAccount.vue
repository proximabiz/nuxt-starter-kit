<script setup lang="ts">
import address from '@/assets/media/address.png'
import card from '@/assets/media/card.png'
import tax from '@/assets/media/gst.png'
import plan from '@/assets/media/plan.png'

const notify = useNotification()
const addressStore = useAddressStore()
// Refs
const selectedComponent = ref()
const userAddress=ref()

const cards = [
  { id: 1, text: 'Address, Contact Details', iconSrc: address, componentName: 'ProfileAddressDetails' },
  { id: 2, text: 'Tax ID / GST Details', iconSrc: tax, componentName: 'ProfileGstAndTax' },
  { id: 3, text: 'Billing & Payments', iconSrc: card, componentName: '' },
  { id: 4, text: 'My Plan', iconSrc: plan, componentName: 'ProfileMyPlans' },
]

async function getAddress() {
  try {
    userAddress.value= await addressStore.fetchAddress()
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
}

async function setComponentName(componentName: string) {
  selectedComponent.value = componentName
 if(selectedComponent.value === 'ProfileAddressDetails'){
  await getAddress()
 }
}
</script>

<template>
  <section v-if="!selectedComponent" class="grid place-items-center">
    <div class="grid grid-cols-2 gap-10 mt-20">
      <UCard
        v-for="item in cards" :key="item.id"
        class="minimum-width hover:bg-gray-300 delay-150 cursor-pointer sm:min-w-20"
        @click="setComponentName(item.componentName)"
      >
        <div class="flex items-center">
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

  <ProfileAddresDetails v-if="selectedComponent === 'ProfileAddressDetails'" :addressDetails="userAddress"/>
  <ProfileGstAndTax v-if="selectedComponent === 'ProfileGstAndTax'" />
  <ProfileMyPlans v-if="selectedComponent === 'ProfileMyPlans'" />
</template>

<style scoped>
.minimum-width {
  min-width: 24rem;
}
</style>
