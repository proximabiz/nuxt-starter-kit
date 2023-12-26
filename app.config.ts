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
    // https://ui.nuxt.com/getting-started/theming
    primary: 'blue',
    gray: 'zinc',
    icons: {
      dynamic: true,
    },
    button: {
      default: {
        loadingIcon: 'lucide:loader-2',
      },
    },
  },
})
