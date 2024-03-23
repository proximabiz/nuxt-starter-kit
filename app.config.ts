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
  },
})
