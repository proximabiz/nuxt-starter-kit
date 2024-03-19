<script setup lang="ts">
import { z } from 'zod'

/** Constants */
const supabaseClient = useSupabaseClient()
const notify = useNotification()
const userStore = useUserStore()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

/** Refs */
const formState = reactive({
  email: '',
  password: '',
})
const loading = ref<boolean>(false)

/** Methods */
function isFormValid() {
  const isEmailValid = z.string().email().safeParse(formState.email).success
  const isPasswordValid = z.string().min(8).safeParse(formState.password).success
  return isEmailValid && isPasswordValid
}

async function signInWithPassword() {
  try {
    loading.value = true

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: formState.email,
      password: formState.password,
    })

    if (error)
      throw error

    if (data) {
      // Check if user has filled the personal details already
      const response = await userStore.fetchAddress()
      if (!response)
        return

      if (!response?.userDetails[0]?.name || !response?.userDetails[0]?.organisation_name)
        return navigateTo('/user/personal-details')
      return navigateTo('/app/diagram/list')
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

  await signInWithPassword()
}
</script>

<template>
  <UForm :schema="schema" :state="formState" class="space-y-4" @submit.stop="onSubmit">
    <div class="mt-4">
      <UFormGroup name="email">
        <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
        <input
          v-model="formState.email"
          class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
          type="email"
        >
      </UFormGroup>
    </div>
    <div class="mt-4">
      <UFormGroup name="password">
        <div class="flex justify-between">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        </div>
        <input
          v-model="formState.password"
          class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
          type="password"
        >
      </UFormGroup>
    </div>
    <div class="mt-8">
      <UButton block class="font-bold py-2 px-4" type="submit" :loading="loading" @click.stop="onSubmit">
        Sign In
      </UButton>
    </div>
  </UForm>
</template>
