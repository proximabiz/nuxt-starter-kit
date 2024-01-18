<script setup lang="ts">
const route = useRoute()
import address from '@/assets/media/address.png';
import tax from '@/assets/media/gst.png';
import card from '@/assets/media/card.png';
import plan from '@/assets/media/plan.png';

const cards = [
    { id: 1, text: 'Address, Contact Details', iconSrc:address,to:"/profile/address"},
    { id: 2, text: 'Tax ID / GST Details', iconSrc: tax,to:"/profile/gstandtax" },
    { id: 3, text: 'Billing & Payments', iconSrc: card,to:"" },
    { id: 4, text: 'My Plan', iconSrc: plan,to:"/profile/plans" },
];
function isActiveCard(to: string) {
  return route.path === to
}
</script>

<template>
    <UContainer>
        <section class="mt-8">
            <h1 class="text-2xl font-semibold">Your Account</h1>
        </section>
        <section class="grid place-items-center">
            <div class="grid grid-cols-2 gap-10 mt-20">               
                <UCard v-for="card in cards" :key="card.id" :class="{ 'bg-gray-300': isActiveCard(card.to) }" class="minimum-width hover:bg-gray-300 delay-150 cursor-pointer sm:min-w-20">
                    <NuxtLink :to="card.to">
                    <div class="flex items-center">
                        <div>
                            <img :src="card.iconSrc" class="h-10" alt="" />
                        </div>
                         <div class="text">{{ card.text }}</div>
                    </div>
                </NuxtLink>
                </UCard>
            </div>
        </section>
    </UContainer>
</template>

<style scoped>
.minimum-width {
    min-width: 24rem;
}
</style>