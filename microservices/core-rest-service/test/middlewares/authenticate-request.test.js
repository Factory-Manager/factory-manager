import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createAuthenticateRequest } from '../../src/middlewares/authenticate-request.js'
import { ERROR_CODES } from '../../src/errors/error-codes.js'
import { AppError } from '../../src/errors/app-error.js'

const DECODED = Object.freeze({ sub: 'user-id', role: 'operator' })

function createFakeJwtService(overrides = {}) {
  return {
    verifyToken(_token) {
      return DECODED
    },
    ...overrides
  }
}

describe('authenticateRequest Middleware', () => {
  it('throws 401 when Authorization header is missing', () => {
    const mw = createAuthenticateRequest({ jwtService: createFakeJwtService() })

    assert.throws(
      () => mw({ headers: {} }, {}, () => {}),
      (err) =>
        err instanceof AppError &&
        err.statusCode === 401 &&
        err.code === ERROR_CODES.UNAUTHORIZED
    )
  })

  it('throws 401 when Authorization header has incorrect format', () => {
    const mw = createAuthenticateRequest({ jwtService: createFakeJwtService() })

    assert.throws(
      () => mw({ headers: { authorization: 'Basic abc123' } }, {}, () => {}),
      (err) => err instanceof AppError && err.statusCode === 401
    )
  })

  it('sets req.auth and calls next for a valid token', () => {
    const mw = createAuthenticateRequest({ jwtService: createFakeJwtService() })
    const req = { headers: { authorization: 'Bearer valid-token' } }
    let nextCalled = false

    mw(req, {}, () => {
      nextCalled = true
    })

    assert.equal(nextCalled, true)
    assert.deepEqual(req.auth, DECODED)
  })

  it('throws 401 when token verification fails', () => {
    const mw = createAuthenticateRequest({
      jwtService: createFakeJwtService({
        verifyToken(_token) {
          throw new Error('invalid signature')
        }
      })
    })

    assert.throws(
      () =>
        mw({ headers: { authorization: 'Bearer bad-token' } }, {}, () => {}),
      (err) => err instanceof AppError && err.statusCode === 401
    )
  })
})
