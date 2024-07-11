<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="min-h-screen grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
      <AuthSidebar />

      <div class="lg:col-span-2 flex justify-center items-center">
        <div>
          <AuthResetPassword />
        </div>
      </div>
    </div>
  </div>
</template>
