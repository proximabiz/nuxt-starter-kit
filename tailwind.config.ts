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
  ],
  theme: {
    extend: {
      colors: customColors,
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      circle: 'circle',
    },
  },
  plugins: [],
}
