<script setup lang="ts">
import { z } from 'zod'

const state = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
  message: undefined,
})
const schema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .refine(value => /^[0-9]+$/.test(value) && value.length >= 10, {
      message: 'Phone must be a valid number with at least 10 digits',
    }),
  message: z.string().nonempty('Name is required'),
})

// type Schema = z.output<typeof schema>

// const validate = (state: any): FormError[] => {
//   const errors = []
//   if (!state.name) errors.push({ path: 'name', message: 'Required' })
//   if (!state.email) errors.push({ path: 'email', message: 'Required' })
//   if (!state.phone) errors.push({ path: 'phone', message: 'Required' })
//   return errors
// }

async function onSubmit() {
  // Do something with data
}
</script>

<template>
  <div class="mt-8 p-8">
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-3xl font-extrabold text-custom1-500">
        Send Us A Message
      </p>
      <p class="text-4xl font-extrabold text-custom5-500">
        Quick Contact
      </p>
    </section>
    <!-- <section class="grid grid-cols-2 gap-12"> -->

    <UForm :schema="schema" :state="state" class="grid grid-cols-2 gap-16" @submit="onSubmit">
      <div class="flex flex-col gap-6">
        <UFormGroup name="name">
          <UInput v-model="state.name" placeholder="Your Name" class="custom-input" />
        </UFormGroup>
        <UFormGroup name="email">
          <UInput v-model="state.email" placeholder="Your Email" />
        </UFormGroup>
        <UFormGroup name="phone">
          <UInput v-model="state.phone" placeholder="Your Phone no" />
        </UFormGroup>
      </div>
      <div class="flex flex-col gap-4">
        <UFormGroup name="message">
          <UTextarea v-model="state.message" size="xl" variant="outline" placeholder="Write your query/message" />
        </UFormGroup>
        <UButton type="submit" class="btn">
          Submit
        </UButton>
      </div>
    </UForm>
    <!-- </section> -->
  </div>
</template>

<style scoped>
.btn {
  display: inline-block;
  width: fit-content;
  padding: 0.5rem;
}
.custom-input input[type='text'] {
  border-color: black !important;
}
</style>
