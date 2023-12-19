// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  // https://nuxt.com/modules
  modules: ['@nuxtjs/eslint-module'],
  // https://nuxt.com/modules/eslint
  eslint: {
    cache: true,
    formatter: 'stylish',
    lintOnStart: true,
    emitWarning: true,
    emitError: true,
    failOnWarning: true,
    failOnError: false
  }
});
