<script setup>
import address from '@/assets/media/address.png';
import tax from '@/assets/media/gst.png';
import card from '@/assets/media/card.png';
import plan from '@/assets/media/plan.png';

const cards = [
    { id: 1, text: 'Address, Contact Details', iconSrc:address},
    { id: 2, text: 'Tax ID / GST Details', iconSrc: tax },
    { id: 3, text: 'Billing & Payments', iconSrc: card },
    { id: 4, text: 'My Plan', iconSrc: plan },
];
</script>

<template>
    <UContainer>
        <section class="mt-8">
            <h1 class="text-2xl font-semibold">Your Account</h1>
        </section>
        <section class="grid place-items-center">
            <div class="grid grid-cols-2 gap-10 mt-20">
                <UCard v-for="card in cards" :key="card.id" class="maximum-width hover:bg-gray-300 delay-150 cursor-pointer sm:min-w-20">
                    <div class="flex items-center">
                        <div>
                            <img :src="card.iconSrc" class="h-10" alt="" />
                        </div>
                         <div class="text">{{ card.text }}</div>
                    </div>
                </UCard>
            </div>
        </section>
    </UContainer>
</template>



<style scoped>
.maximum-width {
    min-width: 24rem;
}
</style>