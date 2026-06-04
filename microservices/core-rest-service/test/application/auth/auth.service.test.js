import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createAuthService } from '../../../src/application/auth/auth.service.js'

const USER_ID = 'a'.repeat(24)

const ACTIVE_USER = Object.freeze({
  _id: { toString: () => USER_ID },
  email: 'operator@fm.com',
  passwordHash: 'hashed-password',
  role: 'operator',
  isActive: true
})

const UPDATED_USER = Object.freeze({
  id: USER_ID,
  name: { first: 'Mario', last: 'Rossi' },
  email: 'operator@fm.com',
  role: 'operator',
  isActive: true,
  lastLoginAt: new Date('2026-06-01T10:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T10:00:00.000Z'),
  fullName: 'Mario Rossi'
})

function createFakeRepo(overrides = {}) {
  return {
    async findUserByEmailForAuth(_email) {
      return ACTIVE_USER
    },
    async updateLastLoginAt(_userId, _date) {
      return UPDATED_USER
    },
    ...overrides
  }
}

function createFakeHasher(valid = true) {
  return {
    async verifyPassword(_credentials) {
      return valid
    }
  }
}

function createFakeJwtService() {
  return {
    expiresIn: '1h',
    generateToken(payload) {
      return `token:${payload.sub}:${payload.role}`
    }
  }
}

function createService(repoOverrides = {}, valid = true) {
  return createAuthService({
    userRepository: createFakeRepo(repoOverrides),
    passwordHasher: createFakeHasher(valid),
    jwtService: createFakeJwtService()
  })
}

describe('authService.login', () => {
  it('returns null when user is not found', async () => {
    const service = createService({
      async findUserByEmailForAuth(_email) {
        return null
      }
    })

    const result = await service.login({
      email: 'unknown@fm.com',
      password: 'x'
    })

    assert.equal(result, null)
  })

  it('returns null when user is inactive', async () => {
    const service = createService({
      async findUserByEmailForAuth(_email) {
        return { ...ACTIVE_USER, isActive: false }
      }
    })

    const result = await service.login({
      email: 'operator@fm.com',
      password: 'x'
    })

    assert.equal(result, null)
  })

  it('returns null when password is wrong', async () => {
    const service = createService({}, false)

    const result = await service.login({
      email: 'operator@fm.com',
      password: 'wrong'
    })

    assert.equal(result, null)
  })

  it('returns accessToken, tokenType, expiresIn and user on success', async () => {
    const service = createService()

    const result = await service.login({
      email: 'operator@fm.com',
      password: 'Password123!'
    })

    assert.ok(result)
    assert.equal(typeof result.accessToken, 'string')
    assert.equal(result.tokenType, 'Bearer')
    assert.equal(result.expiresIn, '1h')
    assert.ok(result.user)
    assert.equal(result.user.id, USER_ID)
    assert.equal(result.user.email, 'operator@fm.com')
  })

  it('generates token with sub and role', async () => {
    let capturedPayload = null

    const service = createAuthService({
      userRepository: createFakeRepo(),
      passwordHasher: createFakeHasher(),
      jwtService: {
        expiresIn: '1h',
        generateToken(payload) {
          capturedPayload = payload
          return 'test-token'
        }
      }
    })

    await service.login({ email: 'operator@fm.com', password: 'Password123!' })

    assert.ok(capturedPayload)
    assert.equal(capturedPayload.sub, USER_ID)
    assert.equal(capturedPayload.role, 'operator')
    assert.equal(capturedPayload.email, undefined)
  })

  it('updates lastLoginAt with a Date on success', async () => {
    let capturedDate = null

    const service = createAuthService({
      userRepository: createFakeRepo({
        async updateLastLoginAt(_userId, date) {
          capturedDate = date
          return UPDATED_USER
        }
      }),
      passwordHasher: createFakeHasher(),
      jwtService: createFakeJwtService()
    })

    await service.login({ email: 'operator@fm.com', password: 'Password123!' })

    assert.ok(capturedDate instanceof Date)
  })
})
