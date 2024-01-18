import type { Config } from 'tailwindcss'
import { customColors } from './utility/appColors'

export default <Partial<Config>> {
  content: [
    'docs/content/**/*.md',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './node_modules/flowbite/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: customColors,
    },
  },
  plugins: [
    // eslint-disable-next-line ts/no-require-imports
    require('flowbite/plugin'),
  ],
}
