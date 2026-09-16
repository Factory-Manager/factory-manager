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
      '@typescript-eslint/no-unused-vars': 'warn',
    }
  },
  
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]