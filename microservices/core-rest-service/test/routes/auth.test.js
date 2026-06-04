import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { ERROR_CODES } from '../../src/errors/error-codes.js'
import { errorHandler } from '../../src/middlewares/error-handler.js'
import { notFoundHandler } from '../../src/middlewares/not-found-handler.js'
import { createAuthRouter } from '../../src/routes/auth.router.js'
import { closeTestServer, startTestServer } from '../utils/server.js'

const VALID_LOGIN_BODY = Object.freeze({
  email: 'operator@fm.com',
  password: 'Password123!'
})

const LOGIN_RESULT = Object.freeze({
  accessToken: 'test-token',
  tokenType: 'Bearer',
  expiresIn: '1h',
  user: { id: 'user-id', role: 'operator' }
})

function createFakeAuthService(overrides = {}) {
  return {
    async login(_input) {
      return LOGIN_RESULT
    },
    ...overrides
  }
}

function createTestApp(authService) {
  const app = express()
  app.use(express.json())
  app.use('/api/auth', createAuthRouter({ authService }))
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}

describe('auth routes', () => {
  it('POST /api/auth/login returns token on valid credentials', async () => {
    const { server, baseUrl } = startTestServer(
      createTestApp(createFakeAuthService())
    )

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_LOGIN_BODY)
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.accessToken, LOGIN_RESULT.accessToken)
      assert.equal(body.tokenType, 'Bearer')
      assert.equal(body.expiresIn, '1h')
      assert.ok(body.user)
    } finally {
      await closeTestServer(server)
    }
  })

  it('POST /api/auth/login returns 401 on invalid credentials', async () => {
    const { server, baseUrl } = startTestServer(
      createTestApp(
        createFakeAuthService({
          async login(_input) {
            return null
          }
        })
      )
    )

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_LOGIN_BODY)
      })
      const body = await response.json()

      assert.equal(response.status, 401)
      assert.equal(body.code, ERROR_CODES.UNAUTHORIZED)
    } finally {
      await closeTestServer(server)
    }
  })

  it('POST /api/auth/login returns 400 on invalid body', async () => {
    const { server, baseUrl } = startTestServer(
      createTestApp(createFakeAuthService())
    )

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' })
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('POST /api/auth/logout returns 204', async () => {
    const { server, baseUrl } = startTestServer(
      createTestApp(createFakeAuthService())
    )

    try {
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST'
      })

      assert.equal(response.status, 204)
    } finally {
      await closeTestServer(server)
    }
  })
})
