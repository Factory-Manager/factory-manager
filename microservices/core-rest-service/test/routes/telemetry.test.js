import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { USER_ROLES } from '#src/domain/users/user.roles.js'
import { AppError } from '#src/errors/app-error.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'
import { errorHandler } from '#src/middlewares/error-handler.js'
import { notFoundHandler } from '#src/middlewares/not-found-handler.js'
import { createTelemetryRouter } from '#src/routes/telemetry.router.js'
import { closeTestServer, startTestServer } from '#test/utils/server.js'
import {
  TELEMETRY_TEST_VALUES,
  createAnomalyTelemetryInput,
  createValidCreateTelemetryInput
} from '#test/factories/telemetry.js'

const VALID_ID = 'a'.repeat(24)

const VALID_TELEMETRY = Object.freeze({
  id: VALID_ID,
  eventId: TELEMETRY_TEST_VALUES.eventId,
  machineId: TELEMETRY_TEST_VALUES.machineId,
  sequenceNumber: TELEMETRY_TEST_VALUES.sequenceNumber,
  capturedAt: TELEMETRY_TEST_VALUES.capturedAt,
  readings: {
    powerConsumption: 42.5,
    emissions: 12.3,
    operatingTemperature: 76.2,
    vibration: 3.1,
    pressure: 2.4
  },
  anomaly: { isAnomaly: false, details: [] },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
})

function createFakeAuthenticate(role = USER_ROLES.OPERATOR) {
  return function (req, _res, next) {
    req.auth = { sub: VALID_ID, role }
    next()
  }
}

function createFakeServiceToken(valid = true) {
  return function (_req, _res, next) {
    if (valid) {
      return next()
    }
    throw AppError.unauthorized('Invalid or missing service token')
  }
}

function createFakeTelemetryService(overrides = {}) {
  return {
    async createTelemetry(_input) {
      return VALID_TELEMETRY
    },
    async listTelemetry(_query) {
      return [VALID_TELEMETRY]
    },
    ...overrides
  }
}

function startTelemetryRoutesTestServer(
  serviceOverrides = {},
  authenticateRequest = createFakeAuthenticate(),
  authenticateServiceToken = createFakeServiceToken()
) {
  const telemetryService = createFakeTelemetryService(serviceOverrides)
  const app = express()
  app.use(express.json())
  app.use(
    '/api/telemetry',
    createTelemetryRouter({
      telemetryService,
      authenticateRequest,
      authenticateServiceToken
    })
  )
  app.use(notFoundHandler)
  app.use(errorHandler)
  return startTestServer(app)
}

describe('telemetry routes', () => {
  it('ingests telemetry via service token', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createValidCreateTelemetryInput())
      })
      const body = await response.json()

      assert.equal(response.status, 201)
      assert.equal(body.eventId, VALID_TELEMETRY.eventId)
      assert.equal(body.machineId, VALID_TELEMETRY.machineId)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects POST without service token', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer(
      {},
      createFakeAuthenticate(),
      createFakeServiceToken(false)
    )
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createValidCreateTelemetryInput())
      })
      const body = await response.json()

      assert.equal(response.status, 401)
      assert.equal(body.code, ERROR_CODES.UNAUTHORIZED)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects POST with invalid body', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: 'evt-1' })
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects POST when anomaly has isAnomaly true but empty details', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          createValidCreateTelemetryInput({
            anomaly: { isAnomaly: true, details: [] }
          })
        )
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('accepts POST with anomaly and non-empty details', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createAnomalyTelemetryInput())
      })

      assert.equal(response.status, 201)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 409 on duplicate eventId', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer({
      async createTelemetry(_input) {
        const err = Object.assign(new Error('E11000'), {
          name: 'MongoServerError',
          code: 11000
        })
        throw err
      }
    })
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createValidCreateTelemetryInput())
      })
      const body = await response.json()

      assert.equal(response.status, 409)
      assert.equal(body.code, ERROR_CODES.CONFLICT)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns list of telemetry events with JWT', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.ok(Array.isArray(body))
      assert.equal(body[0].eventId, VALID_TELEMETRY.eventId)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns filtered list with optional query params', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const url =
        `${baseUrl}/api/telemetry` +
        `?machineId=${TELEMETRY_TEST_VALUES.machineId}` +
        `&from=2026-01-01T00:00:00.000Z` +
        `&to=2026-12-31T23:59:59.999Z` +
        `&limit=10&offset=0&sort=asc`
      const response = await fetch(url)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.ok(Array.isArray(body))
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 401 on GET /api/telemetry when not authenticated', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer(
      {},
      (_req, _res, _next) => {
        throw AppError.unauthorized('Authentication required')
      }
    )
    try {
      const response = await fetch(`${baseUrl}/api/telemetry`)

      assert.equal(response.status, 401)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 400 for invalid sort value on GET /api/telemetry', async () => {
    const { server, baseUrl } = startTelemetryRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/telemetry?sort=invalid`)
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })
})
