// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-icon', '@nuxtjs/i18n'],
  ui: {
    global: true,
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
})
