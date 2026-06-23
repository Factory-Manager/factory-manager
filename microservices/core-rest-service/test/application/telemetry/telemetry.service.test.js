import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createTelemetryService } from '#src/application/telemetry/telemetry.service.js'
import { TELEMETRY_PAGINATION_POLICY } from '#src/application/telemetry/telemetry.pagination.js'
import { SENSOR_TYPES } from '#src/domain/machines/sensor.types.js'
import {
  TELEMETRY_TEST_VALUES,
  createAnomalyTelemetryInput,
  createValidCreateTelemetryInput
} from '#test/factories/telemetry.js'

const TELEMETRY_OUTPUT = Object.freeze({
  id: 'tel-1',
  eventId: TELEMETRY_TEST_VALUES.eventId,
  machineId: TELEMETRY_TEST_VALUES.machineId,
  sequenceNumber: TELEMETRY_TEST_VALUES.sequenceNumber,
  capturedAt: new Date(TELEMETRY_TEST_VALUES.capturedAt),
  readings: {
    powerConsumption: 42.5,
    emissions: 12.3,
    operatingTemperature: 76.2,
    vibration: 3.1,
    pressure: 2.4
  },
  anomaly: { isAnomaly: false, details: [] },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
})

function createTelemetryRepositoryDouble(overrides = {}) {
  return {
    async createTelemetry(data) {
      return { ...TELEMETRY_OUTPUT, ...data }
    },
    async findTelemetry(_query) {
      return [TELEMETRY_OUTPUT]
    },
    ...overrides
  }
}

function createMachineRepositoryDouble(overrides = {}) {
  return {
    async findMachineById(_id) {
      return { id: TELEMETRY_TEST_VALUES.machineId }
    },
    ...overrides
  }
}

function createServiceTestContext(
  telemetryOverrides = {},
  machineOverrides = {}
) {
  const telemetryRepository =
    createTelemetryRepositoryDouble(telemetryOverrides)
  const machineRepository = createMachineRepositoryDouble(machineOverrides)
  const telemetryService = createTelemetryService({
    telemetryRepository,
    machineRepository
  })
  return { telemetryService, telemetryRepository, machineRepository }
}

describe('telemetry service', () => {
  it('throws if telemetryRepository is missing', () => {
    assert.throws(
      () =>
        createTelemetryService({
          machineRepository: createMachineRepositoryDouble()
        }),
      TypeError
    )
  })

  it('throws if machineRepository is missing', () => {
    assert.throws(
      () =>
        createTelemetryService({
          telemetryRepository: createTelemetryRepositoryDouble()
        }),
      TypeError
    )
  })

  it('creates telemetry and returns public output', async () => {
    const { telemetryService } = createServiceTestContext()
    const input = createValidCreateTelemetryInput()

    const record = await telemetryService.createTelemetry(input)

    assert.equal(record.eventId, TELEMETRY_TEST_VALUES.eventId)
    assert.equal(record.machineId, TELEMETRY_TEST_VALUES.machineId)
    assert.equal('_id' in record, false)
  })

  it('throws 404 when machine not found on ingest', async () => {
    const { telemetryService } = createServiceTestContext(
      {},
      {
        async findMachineById(_id) {
          return null
        }
      }
    )

    await assert.rejects(
      () => telemetryService.createTelemetry(createValidCreateTelemetryInput()),
      (err) => err.statusCode === 404
    )
  })

  it('stores capturedAt as a Date', async () => {
    const createCalls = []
    const { telemetryService } = createServiceTestContext({
      async createTelemetry(data) {
        createCalls.push(data)
        return TELEMETRY_OUTPUT
      }
    })

    await telemetryService.createTelemetry(createValidCreateTelemetryInput())

    assert.ok(createCalls[0].capturedAt instanceof Date)
  })

  it('normalizes anomaly.details to [] when isAnomaly is false', async () => {
    const createCalls = []
    const { telemetryService } = createServiceTestContext({
      async createTelemetry(data) {
        createCalls.push(data)
        return TELEMETRY_OUTPUT
      }
    })

    await telemetryService.createTelemetry(
      createValidCreateTelemetryInput({
        anomaly: { isAnomaly: false, details: [SENSOR_TYPES.PRESSURE] }
      })
    )

    assert.deepEqual(createCalls[0].anomaly.details, [])
  })

  it('preserves anomaly.details when isAnomaly is true', async () => {
    const createCalls = []
    const { telemetryService } = createServiceTestContext({
      async createTelemetry(data) {
        createCalls.push(data)
        return TELEMETRY_OUTPUT
      }
    })

    await telemetryService.createTelemetry(createAnomalyTelemetryInput())

    assert.equal(createCalls[0].anomaly.isAnomaly, true)
    assert.ok(createCalls[0].anomaly.details.length > 0)
  })

  it('propagates duplicate eventId error from repository', async () => {
    const duplicateError = Object.assign(new Error('E11000'), { code: 11000 })
    const { telemetryService } = createServiceTestContext({
      async createTelemetry(_data) {
        throw duplicateError
      }
    })

    await assert.rejects(
      () => telemetryService.createTelemetry(createValidCreateTelemetryInput()),
      duplicateError
    )
  })

  it('listTelemetry returns serialized list of records', async () => {
    const { telemetryService } = createServiceTestContext()

    const records = await telemetryService.listTelemetry({})

    assert.ok(Array.isArray(records))
    assert.equal(records.length, 1)
    assert.equal('_id' in records[0], false)
    assert.equal(records[0].eventId, TELEMETRY_TEST_VALUES.eventId)
  })

  it('listTelemetry passes machineId filter to repository', async () => {
    const queryCalls = []
    const { telemetryService } = createServiceTestContext({
      async findTelemetry(query) {
        queryCalls.push(query)
        return []
      }
    })

    await telemetryService.listTelemetry({ machineId: 'machine-1' })

    assert.equal(queryCalls[0].machineId, 'machine-1')
  })

  it('listTelemetry converts from/to strings to Date objects', async () => {
    const queryCalls = []
    const { telemetryService } = createServiceTestContext({
      async findTelemetry(query) {
        queryCalls.push(query)
        return []
      }
    })

    await telemetryService.listTelemetry({
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-06-01T00:00:00.000Z'
    })

    assert.ok(queryCalls[0].from instanceof Date)
    assert.ok(queryCalls[0].to instanceof Date)
  })

  it('listTelemetry passes normalized sort to repository', async () => {
    const queryCalls = []
    const { telemetryService } = createServiceTestContext({
      async findTelemetry(query) {
        queryCalls.push(query)
        return []
      }
    })

    await telemetryService.listTelemetry({ sort: 'asc' })

    assert.equal(queryCalls[0].sort, 'asc')
  })

  it('listTelemetry applies default pagination when no params given', async () => {
    const queryCalls = []
    const { telemetryService } = createServiceTestContext({
      async findTelemetry(query) {
        queryCalls.push(query)
        return []
      }
    })

    await telemetryService.listTelemetry({})

    assert.equal(queryCalls[0].limit, TELEMETRY_PAGINATION_POLICY.defaultLimit)
    assert.equal(
      queryCalls[0].offset,
      TELEMETRY_PAGINATION_POLICY.defaultOffset
    )
    assert.equal(queryCalls[0].sort, TELEMETRY_PAGINATION_POLICY.defaultSort)
  })
})
