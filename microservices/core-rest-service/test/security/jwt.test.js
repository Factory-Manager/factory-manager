import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createJwtService } from '../../src/security/jwt.js'

describe('JWT service', () => {
  it('generates a token with the configured secret and expiration', () => {
    const calls = []
    const jwtService = createJwtService({
      sign: (payload, secret, options) => {
        calls.push({ payload, secret, options })
        return 'signed-token'
      },
      verify: () => {},
      secret: 'test-secret',
      expiresIn: '1h'
    })

    const token = jwtService.generateToken({ sub: 'user-id', role: 'admin' })

    assert.equal(token, 'signed-token')
    assert.equal(jwtService.expiresIn, '1h')
    assert.deepEqual(calls, [
      {
        payload: { sub: 'user-id', role: 'admin' },
        secret: 'test-secret',
        options: { expiresIn: '1h' }
      }
    ])
  })

  it('verifies tokens with the configured secret', () => {
    const DECODED = { sub: 'user-id', role: 'admin' }
    const calls = []
    const jwtService = createJwtService({
      sign: () => {},
      verify: (token, secret) => {
        calls.push({ token, secret })
        return DECODED
      },
      secret: 'test-secret',
      expiresIn: '1h'
    })

    const result = jwtService.verifyToken('some-token')

    assert.deepEqual(result, DECODED)
    assert.deepEqual(calls, [{ token: 'some-token', secret: 'test-secret' }])
  })
})
