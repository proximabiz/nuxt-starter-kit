import type { Config } from 'tailwindcss'
import * as flowbitePlugin from 'flowbite/plugin'

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
    extend: {},
  },
  plugins: [
    flowbitePlugin,
  ],
}
