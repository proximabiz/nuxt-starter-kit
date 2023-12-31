import type { Config } from 'tailwindcss'
import aspectratioPlugin from '@tailwindcss/aspect-ratio'

export default <Partial<Config>> {
  content: [
    'docs/content/**/*.md',
  ],
  theme: {
    extend: {},
  },
  plugins: [aspectratioPlugin],
}
