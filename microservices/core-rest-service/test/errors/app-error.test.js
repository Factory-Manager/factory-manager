import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { AppError } from '#src/errors/app-error.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'

describe('AppError', () => {
  it('creates expected application errors', () => {
    const cases = [
      {
        error: AppError.notFound('User not found'),
        message: 'User not found',
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND
      },
      {
        error: AppError.conflict('Email already exists'),
        message: 'Email already exists',
        statusCode: 409,
        code: ERROR_CODES.CONFLICT
      },
      {
        error: AppError.validationError('Invalid request'),
        message: 'Invalid request',
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR
      }
    ]

    for (const { error, message, statusCode, code } of cases) {
      assert.equal(error instanceof Error, true)
      assert.equal(error.message, message)
      assert.equal(error.statusCode, statusCode)
      assert.equal(error.code, code)
    }
  })

  it('adds validation details when provided', () => {
    const details = [
      {
        field: 'email',
        message: 'Email is required'
      }
    ]

    const error = AppError.validationError('Invalid request', details)

    assert.deepEqual(error.details, details)
  })
})
