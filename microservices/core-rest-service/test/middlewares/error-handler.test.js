import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { AppError } from '#src/errors/app-error.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'
import { errorHandler } from '#src/middlewares/error-handler.js'

function createRes() {
  return {
    headersSent: false,
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    }
  }
}

function createNext() {
  const calls = []
  const next = (error) => calls.push(error)
  next.calls = calls
  return next
}

describe('errorHandler', () => {
  it('delegates to next when headers are already sent', () => {
    const error = new Error('too late')
    const res = { ...createRes(), headersSent: true }
    const next = createNext()

    errorHandler(error, {}, res, next)

    assert.deepEqual(next.calls, [error])
    assert.equal(res.statusCode, null)
  })

  it('responds with AppError data', () => {
    const details = [{ field: 'email', message: 'Email is required' }]
    const error = AppError.validationError('Invalid request', details)
    const res = createRes()
    const next = createNext()

    errorHandler(error, {}, res, next)

    assert.equal(res.statusCode, 400)
    assert.deepEqual(res.body, {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid request',
      details
    })
    assert.equal(next.calls.length, 0)
  })

  it('maps known infrastructure errors to API errors', () => {
    const cases = [
      {
        error: Object.assign(new Error('E11000 duplicate key'), {
          name: 'MongoServerError',
          code: 11000
        }),
        statusCode: 409,
        code: ERROR_CODES.CONFLICT
      },
      {
        error: Object.assign(new Error('name.first is required'), {
          name: 'ValidationError'
        }),
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR
      },
      {
        error: Object.assign(new SyntaxError('Unexpected token'), {
          status: 400
        }),
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR
      }
    ]

    for (const { error, statusCode, code } of cases) {
      const res = createRes()
      const next = createNext()

      errorHandler(error, {}, res, next)

      assert.equal(res.statusCode, statusCode)
      assert.equal(res.body.code, code)
    }
  })

  it('responds with internal error for unexpected errors', () => {
    const res = createRes()
    const next = createNext()

    errorHandler(new Error('something exploded'), {}, res, next)

    assert.equal(res.statusCode, 500)
    assert.deepEqual(res.body, {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Internal server error'
    })
  })
})
