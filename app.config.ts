import pkg from './package.json'

export default defineAppConfig({
  app: {
    name: pkg.name,
    desciption: pkg.name,
    version: pkg.version,
  },
  theme: {
    dark: true,
  },
  ui: {
    icons: {
      dynamic: true,
    },
    button: {
      default: {
        color: 'custom1',
      },
    },
    input: {
      default: {
        color: 'custom1',
      },
    },
    textarea: {
      default: {
        color: 'custom1',
      },
    },
  },
  umami: {
    version: 2,
    // host: 'https://analytics.proximabiz.net',
    // id: '3fec1f95-9c56-4c64-a8a2-c6b0bdd0e96a',
  },
})
