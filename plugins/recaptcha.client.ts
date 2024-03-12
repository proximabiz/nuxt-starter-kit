import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin((nuxtApp) => {
  // Runtime config
  const config = useRuntimeConfig()
  // Site key
  const googleRecaptchaSiteKey = config.public.SITE_KEY
  // Use the recaptcha methods
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: googleRecaptchaSiteKey,
    loaderOptions: {
      autoHideBadge: false,
      explicitRenderParameters: {
        badge: 'bottomright',
      },
    },
  })
})
