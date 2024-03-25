<script setup lang="ts">
interface Props {
  planName: string
  duePrice: string
}
const props = defineProps<Props>()
const subscriptionStore = useSubscriptionStore()
const allDetails = computed(() => subscriptionStore.billingDetails)
</script>

<template>
  <section class="grid place-items-center mt-6 gap-3">
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Plan Details:
      </div>
      <div>
        <p class="font-medium text-xl">
          AI Flow maper {{ props.planName }}
        </p>
        <p class="font-bold text-3xl">
          {{ props.duePrice }}
        </p>
        <p>Billed annually. 18% tax included</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Address Details:
      </div>
      <div>
        <p>{{ allDetails.name }}</p>
        <p>{{ allDetails.city }} {{ allDetails.zip }}</p>
        <p>{{ allDetails.country }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 bg-slate-100 p-4 min-width">
      <div class="font-semibold text-2xl">
        Card Details:
      </div>
      <div>
        <p>Name on the card: {{ allDetails.cardHolderName }}</p>
        <p>Credit or debit card number: {{ allDetails.cardNo }}</p>
        <p>Expire date: {{ allDetails.expDate }}</p>
        <p>Security code: {{ allDetails.cvv }}</p>
      </div>
    </div>
    <UButton class="mt-4">
      Complete order
    </UButton>
  </section>
</template>

<style scoped>
.min-width {
  min-width: 30rem;
  max-width: 30rem;
}
</style>
