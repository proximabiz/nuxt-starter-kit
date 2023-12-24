import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  ignores: ['*.d.ts'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'style/max-statements-per-line': ['error', { max: 2 }],
    'style/semi': ['error', 'never'],
    'node/prefer-global/process': 'off',
    'jsonc/sort-keys': 'off',
  },
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  overrides: [],
})
