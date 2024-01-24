
<script setup lang="ts">
const users = ['1user', '2users', '3users']

const user = ref(users[0])
</script>
<template>
    <div class="grid place-items-center mt-8 ">
        <UCard>
            <div class="divide-y divide-solid">
            <header class="flex justify-start">
                AI Flow mapper Pro
            </header>
            <section class="grid grid-cols-2 gap-32 mt-3 py-4">
                <USelect v-model="user" :options="users" />
                <div>
                    <span>12 months * 5 </span>
                    <span class="font-semibold"> $60.00</span>
                </div>
            </section>
            <section class="grid grid-cols-2 gap-32 mt-3 py-4">
                <div>Tax</div>
                <div class="">$11.88</div>
            </section>
            <section class="grid grid-cols-2 gap-32 mt-3 py-4">
                <div class="font-semibold">Due date</div>
                <div class="font-semibold">$77.88</div>
            </section>
        </div>
        </UCard>
        <NuxtLink to="/billing/billing-address">
            <UButton class="mt-4">Continue</UButton>
        </NuxtLink>       
    </div>
</template>
<style scoped></style>