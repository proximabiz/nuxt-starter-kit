<script setup lang="ts">
import { z } from 'zod'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

const selectedOption = ref('demo')

function updateSelection(value: string) {
  selectedOption.value = value
}

const state = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
  message: undefined,
})
// const schema = z.object({
//   name: z.string().min(1,'Name is required'),
//   email: z.string().email('Invalid email'),
//   phone: z
//     .string()
//     .refine((value) => /^[0-9]+$/.test(value) && value.length >= 10, {
//       message: 'Phone must be a valid number with at least 10 digits',
//     }),
//     message: z.string().min(1,'Name is required'),
// })

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email Id'),
  phone: z.number().max(10, 'Phone must be a valid number with at least 10 digits'),
  message: z.string().min(1, 'Message is required'),
})

// type Schema = z.output<typeof schema>

async function onSubmit() {
  // Do something with data
}
</script>

<template>
  <div class="mt-8 p-8">
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-3xl font-extrabold text-blue-700">
        Send Us A Message
      </p>
      <p class="text-4xl font-extrabold text-slate-600">
        Quick Contact
      </p>
    </section>
    <!-- <section class="grid grid-cols-2 gap-12"> -->

    <UForm :schema="schema" :state="state" class="grid grid-cols-2 gap-16" @submit="onSubmit">
      <div class="flex flex-col gap-6">
        <UFormGroup name="name" label="Name" required>
          <UInput v-model="state.name" placeholder="Your Name" />
        </UFormGroup>
        <UFormGroup name="email" label="Email" required>
          <UInput v-model="state.email" placeholder="Your Email" />
        </UFormGroup>
        <UFormGroup name="phone" label="Phone No" required>
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" required :maxlength="10" />
        </UFormGroup>
      </div>
      <div class="flex flex-col gap-6">
        <div class="flex gap-8 mt-4">
          <URadio
            label="Ask for demo"
            color="blue"
            :model-value="selectedOption"
            value="demo"
            @update:model-value="updateSelection"
          />
          <URadio
            label="Ask for free trial"
            color="blue"
            :model-value="selectedOption"
            value="trial"
            @update:model-value="updateSelection"
          />
        </div>
        <UFormGroup name="message" label="Message" required>
          <UTextarea v-model="state.message" color="white" size="xl" variant="outline" placeholder="Write your query/message" />
        </UFormGroup>
        <UButton type="submit" class="w-fit p-3" color="blue">
          Submit
        </UButton>
        <NuxtLink to="/privacy" class="font-medium hover:text-blue-700">
          Privacy Policy
        </NuxtLink>
      </div>
    </UForm>
    <!-- </section> -->
  </div>
</template>
