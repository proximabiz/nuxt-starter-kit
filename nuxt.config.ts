import validateEnvs from './envs/env.validator'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'dev' },
  runtimeConfig: {
    public: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      SITE_KEY: process.env.SITE_KEY,
    },
    private: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_EMAIL_TEMPLATE_ID: process.env.SENDGRID_EMAIL_TEMPLATE_ID,
      SENDGRID_FROM_EMAILID: process.env.SENDGRID_FROM_EMAILID,
      GOOGLE_CAPTCHA_SECRET_KEY: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
    },
  },
  modules: [
    '@nuxt/ui',
    'nuxt-icon',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],
  ui: { global: true },
  tailwindcss: { viewer: false },
  googleFonts: {
    families: {
      Inter: [200, 400, 500, 600, 700],
    },
    display: 'swap',
  },
  fontMetrics: { fonts: ['Inter'] },
  i18n: {
    vueI18n: 'locales/i18n.config.ts',
    defaultLocale: 'en',
    langDir: 'locales/lang',
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
  lodash: { prefix: false },
  hooks: {
    listen: () => validateEnvs(),
  },
  experimental: { typedPages: true },
  css: ['~/assets/css/main.css'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/app/diagram/list',
      exclude: ['/website', '/website/*', '/privacy'],
    },
  },
  // routeRules: {
  //   '/profile/address': { ssr: false },
  // },
  // app: {
  //   head: {
  //     link: [
  //       { rel: 'icon', type: 'image/png', href: logo }
  //     ]
  //   }
  // }
})
