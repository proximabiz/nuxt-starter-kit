<script setup lang="ts">
import { type IReCaptchaComposition, useReCaptcha } from 'vue-recaptcha-v3'
import { z } from 'zod'
import type PhoneInputField from '@/components/lib/VueTelInput/Index.vue'

const { $success, $error } = useNuxtApp()
const contactStore = useContactStore()

/** Refs */
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
  token: '',
})
const phoneRef = ref<typeof PhoneInputField>()

const schema = z.object({
  name: z.string()
    .min(1, 'First Name is required')
    .regex(/^[A-Za-z]{3,}$/, 'Enter a valid name of 3 letters and without numbers and symbols'),
  lastname: z.string()
    .min(1, 'Last Name is required')
    .regex(/^[A-Za-z]{3,}$/, 'Enter a valid name of 3 letters and without numbers and symbols'),
  email: z.string().min(1, 'Email id is required').email('Invalid email Id'),
  message: z.string()
    .min(1, 'Message is required')
    .refine(value => value.trim().split(/\s+/).filter(Boolean).length >= 3, {
      message: 'Message must be at least 3 words',
    }),
})
const recaptchaInstance = useReCaptcha() as IReCaptchaComposition
async function executeRecaptcha() {
  try {
    await recaptchaInstance.recaptchaLoaded()
    state.token = await recaptchaInstance.executeRecaptcha('contact_form_submit')
  }
  catch (error) {
    $error(`Error executing reCAPTCHA: ${error}`)
  }
}
async function onSubmit() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return

  await executeRecaptcha()

  const payload = {
    name: `${state.name} ${state.lastname}`,
    email: state.email,
    phoneNumber: phoneRef.value?.phoneData.number,
    requestFor: selectedOption.value,
    message: state.message,
    token: state.token,
  }

  try {
    const response = await contactStore.create(payload)
    if (response?.status === 201) {
      $success(response.message)
      state.name = ''
      state.lastname = ''
      state.email = ''
      state.phone = ''
      selectedOption.value = 'Demo'
      state.message = ''
      state.token = ''
    }
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

function handlePhoneValidation() {
  if (!phoneRef.value?.handlePhoneValidation().status)
    return false
}
</script>

<template>
  <div class="mt-4 p-4">
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-3xl font-extrabold text-blue-700">
        Send Us A Message
      </p>
      <p class="text-4xl font-extrabold text-slate-600">
        Quick Contact
      </p>
    </section>
    <!-- <section class="grid grid-cols-2 gap-12"> -->
    <UForm :state="state" :schema="schema" @submit="onSubmit">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-16">
        <div class="flex flex-col gap-6 ">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3">
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
          <UFormGroup name="phone" label="Phone" required>
            <LibVueTelInput ref="phoneRef" :prop-phone="state.phone" class="my-4" />
          </UFormGroup>
        </div>
        <div class="flex flex-col gap-6">
          <div class="flex gap-8 mt-4 order-2 md:order-1">
            <URadio
              label="Ask for demo" color="blue" :model-value="selectedOption" value="Demo"
              @update:model-value="updateSelection"
            />
            <URadio
              label="Ask for free trial" color="blue" :model-value="selectedOption" value="Free Trial"
              @update:model-value="updateSelection"
            />
          </div>
          <UFormGroup name="message" label="Message" required class="order-1 md:order-2">
            <UTextarea
              v-model="state.message" color="white" size="xl" variant="outline"
              placeholder="Write your query/message"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center mt-8">
        <UButton type="submit" class="w-fit p-3" color="blue" @click="handlePhoneValidation()">
          Submit
        </UButton>
        <NuxtLink to="/privacy" class="font-medium mt-4 text-custom1-600 underline hover:text-blue-800">
          Privacy Policy
        </NuxtLink>
      </div>
    </UForm>
    <!-- </section> -->
  </div>
</template>
