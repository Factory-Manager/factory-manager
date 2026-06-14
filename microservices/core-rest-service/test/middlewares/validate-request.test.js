import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import Joi from 'joi'

import { AppError } from '#src/errors/app-error.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'
import {
  validateBody,
  validateQuery
} from '#src/middlewares/validate-request.js'

function createNext() {
  const calls = []
  const next = (arg) => calls.push(arg === undefined ? null : arg)
  next.calls = calls
  return next
}

describe('validateRequest', () => {
  it('validates and sanitizes the request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().optional()
    })

    const req = {
      body: {
        name: 'Mario',
        age: 30,
        extra: 'ignored'
      }
    }
    const next = createNext()

    validateBody(schema)(req, {}, next)

    assert.deepEqual(next.calls, [null])
    assert.deepEqual(req.body, {
      name: 'Mario',
      age: 30
    })
  })

  it('passes an AppError when validation fails', () => {
    const schema = Joi.object({
      email: Joi.string().email().required()
    })

    const req = { body: {} }
    const next = createNext()

    validateBody(schema)(req, {}, next)

    assert.equal(next.calls.length, 1)
    assert.equal(next.calls[0] instanceof AppError, true)
    assert.equal(next.calls[0].statusCode, 400)
    assert.equal(next.calls[0].code, ERROR_CODES.VALIDATION_ERROR)
    assert.equal(Array.isArray(next.calls[0].details), true)
  })

  it('validates and normalizes query parameters', () => {
    const schema = Joi.object({
      limit: Joi.number().integer().optional()
    })

    const req = { query: { limit: '20' } }
    const next = createNext()

    validateQuery(schema)(req, {}, next)

    assert.deepEqual(next.calls, [null])
    assert.equal(req.query.limit, 20)
  })
})
