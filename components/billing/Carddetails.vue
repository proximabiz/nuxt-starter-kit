<script setup lang="ts">
import card from '@/assets/media/credit-card.png'
import visa from '@/assets/media/visa.png'
import mastercard from '@/assets/media/mastercard.png'

interface FormState {
  name: string
  orgname: string
  country: string
  zip: string
  city: string
  region: string
  address: string
  phone: string
}
const initialState = {
  name: '',
  orgname: '',
  country: '',
  zip: '',
  city: '',
  region: '',
  address: '',
  phone: '',
}
const state = reactive({ ...initialState })
</script>

<template>
  <div class="bg-slate-100 p-4 rounded-md min-width">
    <p class="font-medium text-xl">
      AI Flow maper Pro
    </p>
    <p class="font-bold text-3xl">
      77.08$
    </p>
    <p>Billed annually. 18% tax included</p>
  </div>
  <UCard class="mb-6 mt-6">
    <div class="flex gap-3 items-center">
      <img :src="card" alt="" class="w-8">
      <span class="font-medium">Pay with card</span>
      <div class="flex gap-3 ml-auto items-center">
        <img :src="visa" alt="" class="">
        <img :src="mastercard" alt="" class="w-14">
      </div>
    </div>

    <UForm :state="state" class="space-y-2">
      <UFormGroup label="Card holder name" name="address">
        <UInput v-model="state.address" placeholder="Card holder name" />
      </UFormGroup>
      <UFormGroup label="Card no" name="address">
        <UInput v-model="state.address" placeholder="**** **** ****" />
      </UFormGroup>
      <div class="flex gap-2">
        <UFormGroup label="Expire date" name="name">
          <UInput v-model="state.name" placeholder="MM/YY" />
        </UFormGroup>
        <UFormGroup label="CVV" name="orgname">
          <UInput v-model="state.orgname" placeholder="****" />
        </UFormGroup>
      </div>
    </UForm>
  </UCard>
</template>

<style scoped>
.min-width {
  min-width: 25.5rem;
}
</style>
