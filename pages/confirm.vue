<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

/** Constants */
const user = useSupabaseUser()
const route = useRoute()

/** Watcher */
watch(user, () => {
  if (user.value) {
    let path = '/profile/account'

    // Check for which action this confirm page is being displayed
    if (route.query && route.query.requestAction === 'signupWithEmailPassword')
      path = '/user/personal-details'

    // Redirect to protected page
    return navigateTo(path)
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen">
    <div class="min-h-screen grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
      <div class="bg-custom1-500 h-full flex items-center justify-center text-center p-8">
        <div class="text-white text-center">
          <a href="#">
            <h5 class="mt-5 text-xl font-bold tracking-tight text-white underline">Let AI Shape Your Ideas With</h5>
          </a>
          <p class="text-4xl font-bold  mt-5">
            AI FLOWMAPPER
          </p>
        </div>
      </div>

      <div class="lg:col-span-2 px-12 flex justify-center items-center">
        <div>
          <div class="py-6 text-center" style="width: 500px;">
            <div class="w-full p-6 bg-white rounded-lg md:mt-0 sm:max-w-md dark:bg-gray-800  sm:p-8">
              <h2 class="mb-5 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Waiting for confirmation...
              </h2>
            </div>
            <div>
              <LayoutAppLoader />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
