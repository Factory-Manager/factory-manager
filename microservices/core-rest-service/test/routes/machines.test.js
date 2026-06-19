import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { MACHINE_STATES } from '#src/domain/machines/machine.states.js'
import { USER_ROLES } from '#src/domain/users/user.roles.js'
import { AppError } from '#src/errors/app-error.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'
import { errorHandler } from '#src/middlewares/error-handler.js'
import { notFoundHandler } from '#src/middlewares/not-found-handler.js'
import { createMachineRouter } from '#src/routes/machine.router.js'
import { closeTestServer, startTestServer } from '#test/utils/server.js'
import {
  MACHINE_TEST_VALUES,
  createValidAnomalyStateInput,
  createValidCreateMachineInput
} from '#test/factories/machines.js'

const VALID_ID = 'a'.repeat(24)

const VALID_MACHINE = Object.freeze({
  id: VALID_ID,
  serial: MACHINE_TEST_VALUES.serial,
  name: MACHINE_TEST_VALUES.name,
  location: { areaId: MACHINE_TEST_VALUES.areaId },
  machineState: { currentState: MACHINE_STATES.OFF, anomalyDetails: [] },
  specifications: {},
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
})

const VALID_CREATE_BODY = createValidCreateMachineInput()

function createFakeAuthenticate(role = USER_ROLES.OPERATOR) {
  return function (req, _res, next) {
    req.auth = { sub: VALID_ID, role }
    next()
  }
}

function rejectAuth(_req, _res, _next) {
  throw AppError.unauthorized('Authentication required')
}

function createFakeServiceToken(valid = true) {
  return function (req, _res, next) {
    if (valid) {
      return next()
    }
    throw AppError.unauthorized('Invalid or missing service token')
  }
}

function createFakeMachineService(overrides = {}) {
  return {
    async createMachine(_input) {
      return VALID_MACHINE
    },
    async listMachines(_query) {
      return [VALID_MACHINE]
    },
    async getMachineById(_id) {
      return VALID_MACHINE
    },
    async updateMachineById(_id, _input) {
      return VALID_MACHINE
    },
    async deleteMachineById(_id) {
      return VALID_MACHINE
    },
    async updateMachineState(_id, _input) {
      return VALID_MACHINE
    },
    ...overrides
  }
}

function startMachineRoutesTestServer(
  serviceOverrides = {},
  authenticateRequest = createFakeAuthenticate(),
  authenticateServiceToken = createFakeServiceToken()
) {
  const machineService = createFakeMachineService(serviceOverrides)
  const app = express()
  app.use(express.json())
  app.use(
    '/api/machines',
    createMachineRouter({
      machineService,
      authenticateRequest,
      authenticateServiceToken
    })
  )
  app.use(notFoundHandler)
  app.use(errorHandler)
  return startTestServer(app)
}

describe('machine routes', () => {
  it('creates a machine', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CREATE_BODY)
      })
      const body = await response.json()

      assert.equal(response.status, 201)
      assert.equal(body.id, VALID_MACHINE.id)
      assert.equal(body.serial, VALID_MACHINE.serial)
    } finally {
      await closeTestServer(server)
    }
  })

  it('rejects create with incomplete specifications', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          createValidCreateMachineInput({
            specifications: {
              powerConsumption: {
                measurementUnit: 'kW',
                normalRange: { min: 0, max: 100 }
              }
            }
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

  it('rejects create with invalid normalRange (max < min)', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          createValidCreateMachineInput({
            specifications: {
              powerConsumption: {
                measurementUnit: 'kW',
                normalRange: { min: 100, max: 10 }
              },
              emissions: {
                measurementUnit: 'g/kWh',
                normalRange: { min: 0, max: 50 }
              },
              operatingTemperature: {
                measurementUnit: '°C',
                normalRange: { min: 15, max: 80 }
              },
              vibration: {
                measurementUnit: 'mm/s',
                normalRange: { min: 0, max: 10 }
              },
              pressure: {
                measurementUnit: 'bar',
                normalRange: { min: 1, max: 8 }
              }
            }
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

  it('rejects create with missing required fields', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Press Alpha' })
      })
      const body = await response.json()

      assert.equal(response.status, 400)
      assert.equal(body.code, ERROR_CODES.VALIDATION_ERROR)
    } finally {
      await closeTestServer(server)
    }
  })

  it('lists machines', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(Array.isArray(body), true)
      assert.equal(body[0].id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('lists machines via service token without JWT', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({}, rejectAuth)
    try {
      const response = await fetch(`${baseUrl}/api/machines`, {
        headers: { 'x-service-token': 'test-token' }
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(Array.isArray(body), true)
    } finally {
      await closeTestServer(server)
    }
  })

  it('gets a machine by id via service token without JWT', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({}, rejectAuth)
    try {
      const response = await fetch(`${baseUrl}/api/machines/${VALID_ID}`, {
        headers: { 'x-service-token': 'test-token' }
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('lists machines filtered by areaId', async () => {
    const receivedQueries = []
    const { server, baseUrl } = startMachineRoutesTestServer({
      async listMachines(query) {
        receivedQueries.push(query)
        return [VALID_MACHINE]
      }
    })
    try {
      const response = await fetch(
        `${baseUrl}/api/machines?areaId=${MACHINE_TEST_VALUES.areaId}`
      )

      assert.equal(response.status, 200)
      assert.equal(receivedQueries[0].areaId, MACHINE_TEST_VALUES.areaId)
    } finally {
      await closeTestServer(server)
    }
  })

  it('gets a machine by id', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 404 when machine not found', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({
      async getMachineById(_id) {
        return null
      }
    })
    try {
      const response = await fetch(`${baseUrl}/api/machines/${VALID_ID}`)
      const body = await response.json()

      assert.equal(response.status, 404)
      assert.equal(body.code, ERROR_CODES.NOT_FOUND)
    } finally {
      await closeTestServer(server)
    }
  })

  it('updates a machine', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Press Beta' })
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('deletes a machine', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(`${baseUrl}/api/machines/${VALID_ID}`, {
        method: 'DELETE'
      })
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('updates machine state via service token', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(
        `${baseUrl}/api/machines/${VALID_ID}/state`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-service-token': 'test-token'
          },
          body: JSON.stringify({ currentState: MACHINE_STATES.OPERATIONAL })
        }
      )
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('updates machine state via JWT', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer()
    try {
      const response = await fetch(
        `${baseUrl}/api/machines/${VALID_ID}/state`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentState: MACHINE_STATES.OPERATIONAL })
        }
      )
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.id, VALID_MACHINE.id)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 422 for an invalid state transition', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({
      async updateMachineState(_id, _input) {
        throw AppError.unprocessableEntity(
          "Transition from 'off' to 'anomaly' is not allowed"
        )
      }
    })
    try {
      const response = await fetch(
        `${baseUrl}/api/machines/${VALID_ID}/state`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createValidAnomalyStateInput())
        }
      )
      const body = await response.json()

      assert.equal(response.status, 422)
      assert.equal(body.code, ERROR_CODES.INVALID_TRANSITION)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 404 when machine not found on state update', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({
      async updateMachineState(_id, _input) {
        return null
      }
    })
    try {
      const response = await fetch(
        `${baseUrl}/api/machines/${VALID_ID}/state`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentState: MACHINE_STATES.OPERATIONAL })
        }
      )
      const body = await response.json()

      assert.equal(response.status, 404)
      assert.equal(body.code, ERROR_CODES.NOT_FOUND)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 401 on PATCH /state when neither service token nor JWT is provided', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({}, rejectAuth)
    try {
      const response = await fetch(
        `${baseUrl}/api/machines/${VALID_ID}/state`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentState: MACHINE_STATES.OPERATIONAL })
        }
      )

      assert.equal(response.status, 401)
    } finally {
      await closeTestServer(server)
    }
  })

  it('returns 401 on all routes when not authenticated', async () => {
    const { server, baseUrl } = startMachineRoutesTestServer({}, rejectAuth)
    try {
      const cases = await Promise.all([
        fetch(`${baseUrl}/api/machines`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(VALID_CREATE_BODY)
        }),
        fetch(`${baseUrl}/api/machines`),
        fetch(`${baseUrl}/api/machines/${VALID_ID}`),
        fetch(`${baseUrl}/api/machines/${VALID_ID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'X' })
        }),
        fetch(`${baseUrl}/api/machines/${VALID_ID}`, { method: 'DELETE' })
      ])

      for (const response of cases) {
        assert.equal(response.status, 401)
      }
    } finally {
      await closeTestServer(server)
    }
  })
})
