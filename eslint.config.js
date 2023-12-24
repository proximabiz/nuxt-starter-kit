import antfu from '@antfu/eslint-config';

export default antfu({
  // TypeScript and Vue are auto-detected, but had to explicitly enable typescript, else not working
  typescript: true,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: ['*.d.ts'],

  // Without `files`, they are general rules for all files
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'style/max-statements-per-line': ['error', { max: 2 }],
    'style/semi': ['error', 'always'],
  },

  // eslint-plugin-format is responsible to format the following extension files
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,

    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,

    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
});
