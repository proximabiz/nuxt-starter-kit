import validateEnvs from './envs/env.validator'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    EXAMPLE_SECRET: process.env.EXAMPLE_SECRET,
    public: {
      EXAMPLE_PUBLIC: process.env.EXAMPLE_PUBLIC,
    },
  },
  modules: ['@nuxt/ui', 'nuxt-icon'],
  ui: {
    global: true,
  },
  tailwindcss: {
    viewer: false,
  },
  hooks: {
    listen: () => validateEnvs(),
  },
})
