import js from '@eslint/js'

export default [
  {
    ignores: ['node_modules/**', 'coverage/**']
  },

  js.configs.recommended,

  {
    files: ['src/**/*.js', 'test/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        fetch: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-param-reassign': 'error',
      'no-implicit-coercion': 'error',
      'no-throw-literal': 'error',
      'no-useless-catch': 'error',
      'no-promise-executor-return': 'error'
    }
  },

  {
    files: ['src/**/*.js'],
    rules: {
      'no-console': 'error'
    }
  },

  {
    files: ['src/**/*.js', 'test/**/*.js', 'scripts/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.\\/\\.\\.',
              message:
                'Use #src/* or #test/* subpath imports instead of deep relative paths.'
            }
          ]
        }
      ]
    }
  },

  {
    files: ['src/domain/**/*.js', 'src/application/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'express',
              message: 'Express belongs in routes/, not domain/application.'
            },
            {
              name: 'mongoose',
              message:
                'Mongoose belongs in persistence/, not domain/application.'
            },
            {
              name: 'joi',
              message: 'Joi belongs in routes/, not domain/application.'
            },
            {
              name: 'argon2',
              message: 'Argon2 belongs in security/, not domain/application.'
            }
          ],
          patterns: [
            {
              group: ['**/persistence/**', '**/routes/**', '**/bootstrap/**'],
              message:
                'Domain and application must not import from infrastructure layers.'
            }
          ]
        }
      ]
    }
  }
]
