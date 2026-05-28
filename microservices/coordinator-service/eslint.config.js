import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', 'dist']
  },

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  }
]