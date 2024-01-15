<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
import { useAuthStore } from '~/stores';

const notify = useNotification()
const authStore = useAuthStore()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'This field is required'),
})

type Schema = z.output<typeof schema>

// State
const form = reactive({
  email: '',
  password: '',
})
const isLoading = ref(false);

// Computed
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Methods
async function signIn(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    // Do something with data
    await authStore.signIn({
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
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="form" @submit="signIn">
    <UFormGroup label="Email" name="email" eager-validation>
      <UInput v-model="form.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" eager-validation class="mt-5">
      <UInput v-model="form.password" type="password" />
    </UFormGroup>

    <UButton label="Login" color="primary" block class="mt-5" type="submit" :loading="isLoading" />
  </UForm>
</template>
