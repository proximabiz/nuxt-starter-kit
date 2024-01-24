<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import type { FormSubmitEvent } from '#ui/types'

interface FormState {
    name: string;
    orgname: string;
    country: string;
    zip: string;
    city: string;
    region: string;
    address: string;
    phone: string;
    email: string;
    isEditable: boolean;
}
const initialState= {
    name: '',
    orgname: '',
    country: '',
    zip: '',
    city: '',
    region: '',
    address: '',
    phone: '',
    email: '',

}
const state = reactive({ ...initialState })

</script>
<template>
    <section class="grid place-items-center mb-8">
        <h1 class="font-semibold mb-4">
            Add Billing Address
        </h1>
        <UCard class="mb-8">
            <UForm :state="state" class="space-y-4">
                <div class="flex gap-2">
                    <UFormGroup label="Name" name="name">
                        <UInput v-model="state.name" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Organisation Name" name="orgname">
                        <UInput v-model="state.orgname" color="blue" />
                    </UFormGroup>
                </div>
                <div class="flex gap-2">
                    <UFormGroup label="Country" name="country">
                        <UInput v-model="state.country" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Zip" name="zip">
                        <UInput v-model="state.zip" color="blue" />
                    </UFormGroup>
                </div>
                <div class="flex gap-2">
                    <UFormGroup label="City" name="city">
                        <UInput v-model="state.city" color="blue" />
                    </UFormGroup>
                    <UFormGroup label="Region" name="region">
                        <UInput v-model="state.region" color="blue" />
                    </UFormGroup>
                </div>
                <UFormGroup label="Address" name="address">
                    <UInput v-model="state.address" color="blue" />
                </UFormGroup>
                <UFormGroup label="Phone no" name="phone">
                    <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" />
                </UFormGroup>
                <UFormGroup label="Email Id" name="email">
                    <UInput v-model="state.email" color="blue" />
                </UFormGroup>
            </UForm>
        </UCard>
        <NuxtLink to="/billing/card-details">
            <UButton class="mt-4">Continue</UButton>
        </NuxtLink> 

    </section>
</template>

<style scoped></style>