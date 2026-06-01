import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  ARGON2ID_PASSWORD_HASHING_OPTIONS,
  createPasswordHasher
} from '../../src/security/password-hasher.js'

describe('Password hasher', () => {
  it('hashes passwords using Argon2id options', async () => {
    const calls = []
    const hasher = createPasswordHasher({
      hash: async (password, options) => {
        calls.push({
          password,
          options
        })

        return 'hashed-password'
      }
    })

    const result = await hasher.hashPassword('Password123!')

    assert.equal(result, 'hashed-password')
    assert.deepEqual(calls, [
      {
        password: 'Password123!',
        options: ARGON2ID_PASSWORD_HASHING_OPTIONS
      }
    ])
  })

  it('verifies passwords', async () => {
    const calls = []
    const hasher = createPasswordHasher({
      verify: async (passwordHash, password) => {
        calls.push({
          passwordHash,
          password
        })

        return true
      }
    })

    const result = await hasher.verifyPassword({
      passwordHash: 'hashed-password',
      password: 'Password123!'
    })

    assert.equal(result, true)
    assert.deepEqual(calls, [
      {
        passwordHash: 'hashed-password',
        password: 'Password123!'
      }
    ])
  })
})
