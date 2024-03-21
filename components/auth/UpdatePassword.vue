<script lang="ts" setup>
import { z } from 'zod'

/** Constants */
const supabaseClient = useSupabaseClient()
const notify = useNotification()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .refine(val => new RegExp(getPasswordRegex()).test(val), {
      message: 'Field must contain at least one uppercase, lowercase, special character, and digit with a minimum of 8 characters. The characters, ", \', <, >, `, \\ are prohibited.',
    }),
  confirmPassword: z
    .string()
    .refine(val => new RegExp(getPasswordRegex()).test(val), {
      message: 'Field must contain at least one uppercase, lowercase, special character, and digit with a minimum of 8 characters. The characters, ", \', <, >, `, \\ are prohibited.',
    }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
})

/** Refs */
const formState = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})
const loading = ref<boolean>(false)
const isPasswordHidden = ref<boolean>(true)
const isConfirmPasswordHidden = ref<boolean>(true)
const confirmEmailDialog = ref<boolean>(false)

/** Computed */
const confirmationMessage = computed(() => `Your password has been changed successfully. You need to login again with the newly created password.`)

/** Methods */
function isFormValid() {
  const isEmailValid = z.string().email().safeParse(formState.email).success
  const isPasswordValid = z.string().min(8).safeParse(formState.password).success
  const isConfirmPasswordValid = z.string().min(8).safeParse(formState.confirmPassword).success
  const isNewAndConfirmPasswordSame = formState.password === formState.confirmPassword

  return isEmailValid && isPasswordValid && isConfirmPasswordValid && isNewAndConfirmPasswordSame
}

async function updatePassword() {
  try {
    loading.value = true

    const { error } = await supabaseClient.auth.updateUser({
      password: formState.password,
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
    return notify.error('Please fill out all the fields correctly.')

  await updatePassword()
}

async function onConfirm() {
  // Mark user logout to login again
  supabaseClient.auth.signOut()
  // Redirect to login screen
  navigateTo('/login')
}
</script>

<template>
  <div class="py-6" style="width: 500px;">
    <div class="w-full p-6 bg-white rounded-lg md:mt-0 sm:max-w-md dark:bg-gray-800  sm:p-8">
      <h2 class="mb-5 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Update Password
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
        <div class="mt-4">
          <UFormGroup name="password">
            <label class="block text-gray-700 text-sm font-bold mb-2">Create Password</label>
            <UInput
              v-model="formState.password"
              input-class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              :type="isPasswordHidden ? 'password' : 'text'"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UIcon :name="isPasswordHidden ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="text-xl cursor-pointer" @click.stop="isPasswordHidden = !isPasswordHidden" />
              </template>
            </UInput>
          </UFormGroup>
        </div>
        <div class="mt-4">
          <UFormGroup name="confirmPassword">
            <label class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <UInput
              v-model="formState.confirmPassword"
              input-class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              :type="isConfirmPasswordHidden ? 'password' : 'text'"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UIcon :name="isConfirmPasswordHidden ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="text-xl cursor-pointer" @click.stop="isConfirmPasswordHidden = !isConfirmPasswordHidden" />
              </template>
            </UInput>
          </UFormGroup>
        </div>
        <div class="mt-8">
          <UButton block class="font-bold py-2 px-4" type="submit" :loading="loading" @click.stop="onSubmit">
            Update Password
          </UButton>
        </div>
      </UForm>
    </div>
    <div class="mt-5 flex items-center justify-between">
      <span class="border-b w-1/5 md:w-1/5" />
      <a href="#" class="my-2" @click.stop="navigateTo('/login')">I'm already a
        member! <span class="text-blue-500">Sign In</span></a>
      <span class="border-b w-1/5 md:w-1/4" />
    </div>

    <!-- Dialog box to show confirm email -->
    <ModalsConfirmationMailSent v-model="confirmEmailDialog" :message="confirmationMessage" @on-confirm="onConfirm()" />
  </div>
</template>
