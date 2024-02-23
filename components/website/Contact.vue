<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import { z } from 'zod';

const notify = useNotification()
const contactStore = useContactStore()
const selectedOption = ref('Demo')

function updateSelection(value: string) {
  selectedOption.value = value
}

const state = reactive({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  message: '',
  request: '',
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
  name: z.string().min(1, 'First Name is required'),
  lastname: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email Id'),
  // phone: z.string().max(15, 'Phone must be a valid number with at least 10 digits'),
  message: z.string().min(1, 'Message is required'),
})

// type Schema = z.output<typeof schema>

async function onSubmit() {
  const payload = {
    name: `${state.name} ${state.lastname}`,
    email: state.email,
    phoneNumber: state.phone,
    requestFor: selectedOption.value,
    message: state.message,
  }

  try {
    const response = await contactStore.create(payload)

    if (response?.status === 201) {
      notify.success(response.message)
      state.name = ''
      state.lastname = ''
      state.email = ''
      state.phone = ''
      selectedOption.value = 'Demo'
      state.message = ''
    }
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
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
        <div class="grid grid-cols-2 gap-3">
          <UFormGroup name="name" label="First Name" required>
            <UInput v-model="state.name" placeholder="First Name" />
          </UFormGroup>
          <UFormGroup name="lastname" label="Last Name" required>
            <UInput v-model="state.lastname" placeholder="Last Name" />
          </UFormGroup>
        </div>

        <UFormGroup name="email" label="Email" required>
          <UInput v-model="state.email" placeholder="Your Email" />
        </UFormGroup>
        <UFormGroup name="phone" label="Phone No" required>
          <VueTelInput v-model="state.phone" placeholder="Your Phone no" mode="international" />
        </UFormGroup>
      </div>
      <div class="flex flex-col gap-6">
        <div class="flex gap-8 mt-4">
          <URadio
            label="Ask for demo" color="blue" :model-value="selectedOption" value="Demo"
            @update:model-value="updateSelection"
          />
          <URadio
            label="Ask for free trial" color="blue" :model-value="selectedOption" value="Free Trial"
            @update:model-value="updateSelection"
          />
        </div>
        <UFormGroup name="message" label="Message" required>
          <UTextarea
            v-model="state.message" color="white" size="xl" variant="outline"
            placeholder="Write your query/message"
          />
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
