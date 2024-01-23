<script setup lang="ts">
// Import predefined theme
import { Auth } from '@nuxtbase/auth-ui-vue';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const authStore = useAuthStore()

const supabaseClient = useSupabaseClient() as unknown as any
</script>

<template>
  <UContainer class="max-w-screen-sm mt-5">
    <Auth
    :supabase-client="supabaseClient"
    :appearance="{
      theme:ThemeSupa,
      style: {
        button: { background: '#435cff', color: 'white' },
        anchor: { color: '#435cff' },
      }
    }"
      :providers="['google']"
    />
  </UContainer>
</template>
