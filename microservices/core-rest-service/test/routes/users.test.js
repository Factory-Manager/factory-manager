import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { ERROR_CODES } from '../../src/errors/error-codes.js'
import { errorHandler } from '../../src/middlewares/error-handler.js'
import { notFoundHandler } from '../../src/middlewares/not-found-handler.js'
import { createUserRouter } from '../../src/routes/user.router.js'
import { closeTestServer, startTestServer } from '../utils/server.js'

const VALID_ID = 'a'.repeat(24)

const VALID_USER = Object.freeze({
  id: VALID_ID,
  name: { first: 'Mario', last: 'Rossi' },
  email: 'operator@fm.com',
  role: 'operator',
  isActive: true,
  lastLoginAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  fullName: 'Mario Rossi'
})

const VALID_CREATE_BODY = Object.freeze({
  name: { first: 'Mario', last: 'Rossi' },
  email: 'operator@fm.com',
  password: 'Password123!'
})

function createFakeUserService(overrides = {}) {
  return {
    async createUser(_input) {
      return VALID_USER
    },
    async listUsers(_pagination) {
      return [VALID_USER]
    },
    async getUserById(_id) {
      return VALID_USER
    },
    async updateUserById(_id, _input) {
      return VALID_USER
    },
    async deleteUserById(_id) {
      return VALID_USER
    },
    ...overrides
  }
}

function createTestApp(userService) {
  const app = express()
  app.use(express.json())

  app.use('/api/users', createUserRouter({ userService }))

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

function startUserRoutesTestServer(serviceOverrides = {}) {
  const userService = createFakeUserService(serviceOverrides)
  const app = createTestApp(userService)

  return startTestServer(app)
}

describe('user routes', () => {
  it('creates a user', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CREATE_BODY)
      })
      const body = await response.json()

      assert.equal(response.status, 201)
      assert.equal(body.id, VALID_USER.id)
      assert.equal(body.email, VALID_USER.email)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects invalid create user input', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'operator@fm.com',
          password: 'Password123!'
        })
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
      assert.equal(Array.isArray(body.details), true)
    } finally {
      await closeTestServer(server)
    }
  })

  it('lists users', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(Array.isArray(body), true)
      assert.equal(body[0].id, VALID_USER.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects invalid list query params', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users?limit=abc`)
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('gets a user by id', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_USER.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns not found when a user does not exist', async () => {
    const { server, baseUrl } = startUserRoutesTestServer({
      async getUserById(_id) {
        return null
      }
    })

    try {
      const response = await fetch(`${baseUrl}/api/users/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 404)
      assert.equal(body.code, ERROR_CODES.NOT_FOUND)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects invalid user ids', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users/invalid-id`)
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('updates a user', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false })
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_USER.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects empty update input', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('deletes a user', async () => {
    const { server, baseUrl } = startUserRoutesTestServer()

    try {
      const response = await fetch(`${baseUrl}/api/users/${VALID_ID}`, {
        method: 'DELETE'
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_USER.id)
    } finally {
      await closeTestServer(server)
    }
  })
})
