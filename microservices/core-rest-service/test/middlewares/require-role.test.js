import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { requireRole } from '../../src/middlewares/require-role.js'
import { AppError } from '../../src/errors/app-error.js'
import { ERROR_CODES } from '../../src/errors/error-codes.js'

describe('requireRole', () => {
  it('it calls next when role is authorized', () => {
    const mw = requireRole('admin')
    let nextCalled = false

    mw({ auth: { sub: 'id', role: 'admin' } }, {}, () => {
      nextCalled = true
    })

    assert.equal(nextCalled, true)
  })

  it('accepts any of multiple allowed roles', () => {
    const mw = requireRole('admin', 'operator')
    let nextCalled = false

    mw({ auth: { sub: 'id', role: 'operator' } }, {}, () => {
      nextCalled = true
    })

    assert.equal(nextCalled, true)
  })

  it('throws 403 when role is not authorized', () => {
    const mw = requireRole('admin')

    assert.throws(
      () => mw({ auth: { sub: 'id', role: 'operator' } }, {}, () => {}),
      (err) =>
        err instanceof AppError &&
        err.statusCode === 403 &&
        err.code === ERROR_CODES.FORBIDDEN
    )
  })

  it('throws 401 when req.auth is missing', () => {
    const mw = requireRole('admin')

    assert.throws(
      () => mw({}, {}, () => {}),
      (err) =>
        err instanceof AppError &&
        err.statusCode === 401 &&
        err.code === ERROR_CODES.UNAUTHORIZED
    )
  })
})
