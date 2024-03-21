<script setup lang="ts">
import { z } from 'zod'

/** Refs */
const formState = reactive({
  email: '',
  password: '',
})
const confirmEmailDialog = ref<boolean>(false)
const isPasswordHidden = ref<boolean>(true)
const loading = ref<boolean>(false)

/** Constants */
const supabaseClient = useSupabaseClient()
const notify = useNotification()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password:
    z
      .string()
      .refine(val => new RegExp(getPasswordRegex()).test(val), {
        message: 'Field must contain at least one uppercase, lowercase, special character, and digit with a minimum of 8 characters. The characters, ", \', <, >, `, \\ are prohibited.',
      }),
})

/** Computed */
const confirmationMessage = computed(() => `We've sent an email to <b>${maskEmail(formState.email)}</b> to confirm the validity of your email address. After receiving the email follow the link provided to complete your registration.`)

/** Methods */
function isFormValid() {
  const isEmailValid = z.string().email().safeParse(formState.email).success
  const isPasswordValid = z.string().min(8).safeParse(formState.password).success
  return isEmailValid && isPasswordValid
}

async function signupWithEmailPassword() {
  try {
    loading.value = true

    const redirectURL = buildURL('/confirm', {
      requestAction: 'signupWithEmailPassword',
    })

    const { data, error } = await supabaseClient.auth.signUp({
      email: formState.email,
      password: formState.password,
      options: {
        emailRedirectTo: redirectURL,
      },
    })

    if (error)
      throw error

    if (data) {
      if (!data.user?.user_metadata.email_verified)
        confirmEmailDialog.value = true
    }
  }
  catch (error) {
    notify.error(error)
  }
  finally {
    loading.value = false
  }
}

async function onSubmit() {
  if (!isFormValid())
    return notify.error('Please fill out all the required fields.')

  await signupWithEmailPassword()
}
</script>

<template>
  <UForm :schema="schema" :state="formState" class="space-y-4" @submit="onSubmit">
    <div class="mt-4">
      <UFormGroup name="email">
        <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
        <UInput
          v-model="formState.email"
          input-class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
          type="email"
        />
      </UFormGroup>
    </div>
    <div class="mt-4">
      <UFormGroup name="password">
        <div class="flex justify-between">
          <label class="block text-gray-700 text-sm font-bold mb-2">Create Password</label>
        </div>
        <UInput
          v-model="formState.password"
          input-class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
          :type="isPasswordHidden ? 'password' : 'text'" :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UIcon
              :name="isPasswordHidden ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="text-xl cursor-pointer"
              @click.stop="isPasswordHidden = !isPasswordHidden"
            />
          </template>
        </UInput>
      </UFormGroup>
    </div>
    <div class="mt-8">
      <UButton block class="font-bold py-2 px-4" type="submit" :loading="loading" @click.stop="onSubmit">
        Sign Up
      </UButton>
    </div>
  </UForm>

  <!-- Dialog box to show confirm email -->
  <ModalsConfirmationMailSent
    v-model="confirmEmailDialog" :message="confirmationMessage" :icon="{
      name: 'i-heroicons-envelope-open',
      color: 'black',
    }"
  />
</template>
