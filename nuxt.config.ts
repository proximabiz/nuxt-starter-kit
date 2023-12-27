import validateEnvs from './envs/env.validator'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    EXAMPLE_SECRET: process.env.EXAMPLE_SECRET,
    public: {
      EXAMPLE_PUBLIC: process.env.EXAMPLE_PUBLIC,
    },
  },
  modules: [
    '@nuxt/ui',
    'nuxt-icon',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  ui: {
    global: true,
  },
  tailwindcss: {
    viewer: false,
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    langDir: 'lang',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json',
      },
    ],
  },
  hooks: {
    listen: () => validateEnvs(),
  },
  experimental: {
    typedPages: true,
  },
})
