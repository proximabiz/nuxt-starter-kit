
import { VueReCaptcha } from 'vue-recaptcha-v3';

export default defineNuxtPlugin((nuxtApp) => {
const googleRecaptchaSiteKey = useRuntimeConfig().SITE_KEY
console.log("googleAPi" ,useRuntimeConfig().SITE_KEY)
    nuxtApp.vueApp.use(VueReCaptcha, {
        siteKey: googleRecaptchaSiteKey,
        loaderOptions: {
            autoHideBadge: false,
            explicitRenderParameters: {
                badge: 'bottomright',
            },
        },
    })
  
});
