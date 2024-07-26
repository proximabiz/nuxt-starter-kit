<script setup lang="ts">
import card from '@/assets/media/bill.png'
import address from '@/assets/media/building.png'
import plan from '@/assets/media/planning.png'
import tax from '@/assets/media/tax.png'

// Refs
const subscriptionStore = useSubscriptionStore()
const sub_status = computed(() => subscriptionStore.subscriptionStatus)

const cards = [
  { id: 1, text: 'Address, Contact Details', iconSrc: address, isDisabled: false, path: '/profile/address-details' },
  { id: 2, text: 'Tax ID / GST Details', iconSrc: tax, isDisabled: false, path: '/profile/tax-details' },
  { id: 3, text: 'Billing & Payments', iconSrc: card, isDisabled: sub_status.value.planName === 'Free', path: '/profile/billing-payments' },
  { id: 4, text: 'My Plan', iconSrc: plan, isDisabled: false, path: '/profile/my-plan' },
]
</script>

<template>
  <div class="grid place-items-center">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 mt-20">
      <UCard
        v-for="item in cards" :key="item.id"
        :class="item.isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-custom1-100 delay-150 cursor-pointer'"
        :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''"
      >
        <NuxtLink :to="item.path">
          <div class="flex items-center py-8" :title="item.isDisabled ? 'This feature is not available for Free Subscription' : ''">
            <div>
              <img :src="item.iconSrc" class="h-10" alt="">
            </div>
            <div class="text-2xl me-6 font-semibold">
              {{ item.text }}
            </div>
          </div>
        </NuxtLink>
      </UCard>
    </div>
  </div>
</template>
