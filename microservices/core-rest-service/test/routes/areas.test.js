import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { USER_ROLES } from '../../src/domain/users/user.roles.js'
import { AppError } from '../../src/errors/app-error.js'
import { ERROR_CODES } from '../../src/errors/error-codes.js'
import { errorHandler } from '../../src/middlewares/error-handler.js'
import { notFoundHandler } from '../../src/middlewares/not-found-handler.js'
import { createAreaRouter } from '../../src/routes/area.router.js'
import { closeTestServer, startTestServer } from '../utils/server.js'

const VALID_ID = 'a'.repeat(24)

const VALID_AREA = Object.freeze({
  id: VALID_ID,
  name: 'Workshop A',
  size: 200,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
})

const VALID_CREATE_BODY = Object.freeze({ name: 'Workshop A', size: 200 })

function createFakeAuthenticate(role = USER_ROLES.OPERATOR) {
  return function (req, _res, next) {
    req.auth = { sub: VALID_ID, role }
    next()
  }
}

function rejectAuth(_req, _res, _next) {
  throw AppError.unauthorized('Authentication required')
}

function createFakeAreaService(overrides = {}) {
  return {
    async createArea(_input) {
      return VALID_AREA
    },
    async listAreas(_pagination) {
      return [VALID_AREA]
    },
    async getAreaById(_id) {
      return VALID_AREA
    },
    async updateAreaById(_id, _input) {
      return VALID_AREA
    },
    async deleteAreaById(_id) {
      return VALID_AREA
    },
    ...overrides
  }
}

function startAreaRoutesTestServer(
  serviceOverrides = {},
  authenticateRequest = createFakeAuthenticate()
) {
  const areaService = createFakeAreaService(serviceOverrides)
  const app = express()
  app.use(express.json())
  app.use('/api/areas', createAreaRouter({ areaService, authenticateRequest }))
  app.use(notFoundHandler)
  app.use(errorHandler)
  return startTestServer(app)
}

describe('area routes', () => {
  it('creates an area', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CREATE_BODY)
      })
      const body = await response.json()

      assert.equal(response.status, 201)
      assert.equal(body.id, VALID_AREA.id)
      assert.equal(body.name, VALID_AREA.name)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects invalid create area input', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Workshop A' })
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
      assert.equal(Array.isArray(body.details), true)
    } finally {
      await closeTestServer(server)
    }
  })

  it('lists areas', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(Array.isArray(body), true)
      assert.equal(body[0].id, VALID_AREA.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('gets an area by id', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_AREA.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns not found when area does not exist', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer({
      async getAreaById(_id) {
        return null
      }
    })
    try {
      const response = await fetch(`${baseUrl}/api/areas/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 404)
      assert.equal(body.code, ERROR_CODES.NOT_FOUND)
    } finally {
      await closeTestServer(server)
    }
  })

  it('updates an area', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 300 })
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_AREA.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('deletes an area', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/areas/${VALID_ID}`, {
        method: 'DELETE'
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_AREA.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 401 on all routes when not authenticated', async () => {
    const { server, baseUrl } = startAreaRoutesTestServer({}, rejectAuth)
    try {
      const cases = await Promise.all([
        fetch(`${baseUrl}/api/areas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(VALID_CREATE_BODY)
        }),
        fetch(`${baseUrl}/api/areas`),
        fetch(`${baseUrl}/api/areas/${VALID_ID}`),
        fetch(`${baseUrl}/api/areas/${VALID_ID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ size: 300 })
        }),
        fetch(`${baseUrl}/api/areas/${VALID_ID}`, { method: 'DELETE' })
      ])

      for (const response of cases) {
        assert.equal(response.status, 401)
      }
    } finally {
      await closeTestServer(server)
    }
  })
})
