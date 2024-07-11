<script setup lang="ts">
enum AuthViews {
  signin = 'signin',
  signup = 'signup',
}

/** Refs */
const currentView = ref<AuthViews>(AuthViews.signin)

/** Computed */
const isCurrentViewSignIn = computed(() => currentView.value === AuthViews.signin)
const isCurrentViewSignUp = computed(() => currentView.value === AuthViews.signup)

/** Methods */
function updateCurrentView(viewName: AuthViews) {
  currentView.value = viewName
}
</script>

<template>
  <div class="py-6 sm:w-500">
    <h2 class="mb-1 text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Sign In to AI FlowMapper
    </h2>
    <div class="flex bg-white overflow-hidden mx-auto">
      <div class="w-full p-8">
        <AuthSignInWithOAuth />

        <div class="mt-4 flex items-center justify-between">
          <span class="border-b w-1/5 lg:w-1/4" />
          <a href="#" class="text-xs text-center text-gray-500 uppercase my-5">or proceed with</a>
          <span class="border-b w-1/5 lg:w-1/4" />
        </div>

        <AuthSignUpWithEmailPassword v-if="isCurrentViewSignUp" />
        <AuthSignInWithEmailPassword v-if="isCurrentViewSignIn" />

        <div class="mt-5 flex items-center justify-between">
          <span class="border-b w-1/5 md:w-1/5" />
          <a v-if="isCurrentViewSignUp" href="#" class="my-5" @click="updateCurrentView(AuthViews.signin)">I'm already a
            member! <span class="text-blue-500">Sign In</span></a>
          <a v-if="isCurrentViewSignIn" href="#" class="my-5" @click="updateCurrentView(AuthViews.signup)">Don't have an
            account? <span class="text-blue-500">Sign Up</span></a>
          <span class="border-b w-1/5 md:w-1/4" />
        </div>
      </div>
    </div>
  </div>
</template>
