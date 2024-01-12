<script setup>
const cards = [
    { id: 1, text: 'Address, Contact Details', iconSrc: '/assets/media/logo.png' },
    { id: 2, text: 'Tax ID / GST Details', iconSrc: '/assets/media/logo.png' },
    { id: 3, text: 'Billing & Payments', iconSrc: '/assets/media/logo.png' },
    { id: 4, text: 'My Plan', iconSrc: '/assets/media/logo.png' },
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
                    <div class="flex"><img :src="card.iconSrc" class="h-8" alt="" />
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