<script lang="ts" setup>
import { z } from 'zod'
import { useAuthStore } from '~/stores'

const notify = useNotification()
const authStore = useAuthStore()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'This field is required'),
})

// State
const form = reactive({
  email: '',
  password: '',
})
const isLoading = ref(false)

// Computed
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Methods
async function signUp() {
  try {
    isLoading.value = true
    // Do something with data
    await authStore.signup({
      email: form.email,
      password: form.password,
    })

    if (isLoggedIn.value) {
      notify.success('SuccessfullyLoggedIn')
      navigateTo('/app/maps')
    }
  }
  catch (error) {
    notify.error(error.statusMessage)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="form" @submit="signUp">
    <UFormGroup label="Email" name="email" eager-validation>
      <UInput v-model="form.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" eager-validation class="mt-5">
      <UInput v-model="form.password" type="password" />
    </UFormGroup>

    <UButton label="Sign Up" block class="mt-5" type="submit" :loading="isLoading" />
  </UForm>
</template>
