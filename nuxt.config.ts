import validateEnvs from './envs/env.validator'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'dev' },
  runtimeConfig: {
    public: {
      SITE_KEY: process.env.SITE_KEY,
      APP_URL: process.env.APP_URL,
    },
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_EMAIL_TEMPLATE_ID: process.env.SENDGRID_EMAIL_TEMPLATE_ID,
    SENDGRID_FROM_EMAILID: process.env.SENDGRID_FROM_EMAILID,
    GOOGLE_CAPTCHA_SECRET_KEY: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
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
  extends: ['nuxt-umami'],
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
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/website', '/website/**', '/reset-password', '/update-password', '/privacy'],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano: process.env.NODE_ENV === 'production'
        ? {
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
            }],
          }
        : false,
    },
  },
})
