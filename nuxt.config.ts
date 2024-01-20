import validateEnvs from './envs/env.validator'

export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    // EXAMPLE_SECRET: process.env.EXAMPLE_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    public: {
      // EXAMPLE_PUBLIC: process.env.EXAMPLE_PUBLIC,
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
  // app: {
  //   head: {
  //     link: [
  //       { rel: 'icon', type: 'image/png', href: '@/assets/media/logo.png' }
  //     ]
  //   }
  // }

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
  nitro: {
    preset: 'netlify',
  },
})
