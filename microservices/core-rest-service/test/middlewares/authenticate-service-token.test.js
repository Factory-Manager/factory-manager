import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createAuthenticateServiceToken } from '#src/middlewares/authenticate-service-token.js'

const VALID_TOKEN = 'test-service-token-abc123'

function createRequest(headers = {}) {
  return { headers }
}

function createNext() {
  const calls = []
  const fn = (err) => calls.push(err ?? null)
  fn.calls = calls
  return fn
}

describe('authenticateServiceToken middleware', () => {
  it('calls next when token matches', () => {
    const middleware = createAuthenticateServiceToken({
      serviceToken: VALID_TOKEN
    })
    const req = createRequest({ 'x-service-token': VALID_TOKEN })
    const next = createNext()

    middleware(req, {}, next)

    assert.equal(next.calls.length, 1)
    assert.equal(next.calls[0], null)
  })

  it('throws 401 when token is missing', () => {
    const middleware = createAuthenticateServiceToken({
      serviceToken: VALID_TOKEN
    })
    const req = createRequest({})

    assert.throws(
      () => middleware(req, {}, () => {}),
      (err) => err.statusCode === 401
    )
  })

  it('throws 401 when token does not match', () => {
    const middleware = createAuthenticateServiceToken({
      serviceToken: VALID_TOKEN
    })
    const req = createRequest({ 'x-service-token': 'wrong-token' })

    assert.throws(
      () => middleware(req, {}, () => {}),
      (err) => err.statusCode === 401
    )
  })

  it('throws 401 when serviceToken is not configured', () => {
    const middleware = createAuthenticateServiceToken({})
    const req = createRequest({ 'x-service-token': VALID_TOKEN })

    assert.throws(
      () => middleware(req, {}, () => {}),
      (err) => err.statusCode === 401
    )
  })
})
