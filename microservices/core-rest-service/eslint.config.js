import js from '@eslint/js'
export default [
  {
    ignores: ['node_modules/**', 'coverage/**']
  },
  js.configs.recommended,

  {
    files: ['src/**/*.js', 'test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]
