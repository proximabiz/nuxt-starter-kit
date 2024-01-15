<script setup lang="ts">
const route = useRoute()

const currentRouteQueryAction = computed(() => route.query.action)
const isSignUpRoute = computed(() => currentRouteQueryAction.value === 'signup')
</script>

<template>
  <UContainer class="max-w-screen-sm mt-5">
    <UCard class="text-xl font-bold text-center border-none border-transparent">
      {{ isSignUpRoute ? 'Sign Up' : 'Sign In' }}
    </UCard>
    <UCard class="w-full h-full">
      <div>
        <AuthSignUpViaEmailPassword v-if="isSignUpRoute" />
        <AuthLoginViaEmailPassword v-else />
      </div>
      <UDivider label="OR" color="gray" class="my-10" />
      <div>
        <AuthLoginViaGoogle />
      </div>
    </UCard>
    <UCard v-if="isSignUpRoute" class="text-lg text-center border-none">
      Already have an account?
      <NuxtLink
        :to="{
          path: '/auth',
          query: {
            action: 'signin',
          },
        }" class="font-thin text-md text-blue-500 underline"
      >
        Sign In
      </NuxtLink>
    </UCard>
    <UCard v-else class="text-lg text-center border-none">
      New to AI Flow Mapper?
      <NuxtLink
        :to="{
          path: '/auth',
          query: {
            action: 'signup',
          },
        }" class="font-thin text-md text-blue-500 underline"
      >
        Sign Up
      </NuxtLink>
    </UCard>
  </UContainer>
</template>
