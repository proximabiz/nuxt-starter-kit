import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript and Vue are auto-detected, but had to explicitly enable typescript, else not working
  typescript: true,

  vue: true,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: ['node_modules', 'nuxt.config.ts', '*-lock.json', 'eslint.config.js', 'dist', '*.d.ts', '.nuxt', '.output'],

  // Without `files`, they are general rules for all files
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',

    // Enforce trailing comma (Already present in TypeScript)
    'comma-dangle': ['error', 'always-multiline'],

    // Enforce consistent spacing inside braces of object (Already present in TypeScript)
    'object-curly-spacing': ['error', 'always'],

    // Disable max-len
    'max-len': 'off',

    // max-statements-per-line
    'max-statements-per-line': ['error', { max: 2 }],

    // we don't want it
    'semi': ['error', 'never'],

    // add parens ony when required in arrow function
    'arrow-parens': ['error', 'as-needed'],

    // add new line above comment
    'newline-before-return': 'error',

    // add new line above comment
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        beforeLineComment: false,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true,
      },
    ],

    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],

    'vue/multi-word-component-names': 'off',

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'expression', next: 'const' },
      { blankLine: 'always', prev: 'const', next: 'expression' },
      { blankLine: 'always', prev: 'multiline-const', next: '*' },
      { blankLine: 'always', prev: '*', next: 'multiline-const' },
    ],
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
})
