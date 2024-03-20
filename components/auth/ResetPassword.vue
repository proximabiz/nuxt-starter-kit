<script lang="ts" setup>
import { z } from 'zod'

/** Constants */
const supabaseClient = useSupabaseClient()
const notify = useNotification()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

/** Refs */
const formState = reactive({
  email: '',
})
const loading = ref<boolean>(false)
const confirmEmailDialog = ref<boolean>(false)

/** Computed */
const confirmationMessage = computed(() => `We've sent an email to <b>${maskEmail(formState.email)}</b> to confirm the validity of your email address. After receiving the email follow the link provided to complete your registration.`)

/** Methods */
function isFormValid() {
  const isEmailValid = z.string().email().safeParse(formState.email).success
  return isEmailValid
}

async function resetPasswordForEmail() {
  try {
    loading.value = true

    const redirectURL = buildURL('/update-password')

    const { error } = await supabaseClient.auth.resetPasswordForEmail(formState.email, {
      redirectTo: redirectURL,
    })

    if (error)
      throw error

    confirmEmailDialog.value = true
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

  await resetPasswordForEmail()
}
</script>

<template>
  <div class="py-6" style="width: 500px;">
    <div class="w-full p-6 bg-white rounded-lg md:mt-0 sm:max-w-md dark:bg-gray-800  sm:p-8">
      <h2 class="mb-5 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Reset Password
      </h2>
      <UForm :schema="schema" :state="formState" class="space-y-4" @submit.stop="onSubmit">
        <div class="mt-4">
          <UFormGroup name="email">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <UInput
              v-model="formState.email"
              input-class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="email"
            />
          </UFormGroup>
        </div>
        <div class="mt-8">
          <UButton block class="font-bold py-2 px-4" type="submit" :loading="loading" @click.stop="onSubmit">
            Send Reset Password Link
          </UButton>
        </div>
      </UForm>
    </div>
    <div class="mt-5 flex items-center justify-between">
      <span class="border-b w-1/5 md:w-1/5" />
      <a class="my-2 cursor-pointer" @click.stop="navigateTo('/login')">I'm already a
        member! <span class="text-blue-500">Sign In</span></a>
      <span class="border-b w-1/5 md:w-1/4" />
    </div>

    <!-- Dialog box to show confirm email -->
    <ModalsConfirmationMailSent v-model="confirmEmailDialog" :message="confirmationMessage" />
  </div>
</template>
