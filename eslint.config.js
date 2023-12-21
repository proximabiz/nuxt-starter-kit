import antfu from '@antfu/eslint-config';

export default antfu({
  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [],

  // TypeScript and Vue are auto-detected, but had to explicitly enable typescript, else not working
  typescript: true,

  // Without `files`, they are general rules for all files
  rules: {
    'style/semi': ['error', 'always'],
    'style/comma-dangle': ['error', 'never']
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
    markdown: 'prettier'
  }
});
