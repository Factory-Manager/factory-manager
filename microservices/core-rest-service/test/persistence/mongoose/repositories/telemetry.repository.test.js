import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createTelemetryRepository } from '#src/persistence/mongoose/repositories/telemetry.repository.js'
import { createValidTelemetryData } from '#test/factories/telemetry.js'

function createQueryChain(result, calls) {
  return {
    sort(sortSpec) {
      calls.push({ method: 'sort', sortSpec })
      return this
    },
    skip(n) {
      calls.push({ method: 'skip', n })
      return this
    },
    limit(n) {
      calls.push({ method: 'limit', n })
      return this
    },
    async exec() {
      return result
    }
  }
}

function createTelemetryModelDouble(overrides = {}) {
  const calls = []

  return {
    calls,

    async create(telemetryData) {
      calls.push({ method: 'create', telemetryData })
      return { id: 'created-telemetry', ...telemetryData }
    },

    find(filter) {
      calls.push({ method: 'find', filter })
      return createQueryChain([{ id: 'tel-1' }], calls)
    },

    ...overrides
  }
}

const DEFAULT_QUERY = Object.freeze({
  machineId: undefined,
  from: undefined,
  to: undefined,
  limit: 50,
  offset: 0,
  sort: 'desc'
})

describe('Telemetry repository', () => {
  it('creates a telemetry record', async () => {
    const telemetryData = createValidTelemetryData()
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    const record = await repository.createTelemetry(telemetryData)

    assert.deepEqual(record, { id: 'created-telemetry', ...telemetryData })
    assert.deepEqual(telemetryModel.calls[0], {
      method: 'create',
      telemetryData
    })
  })

  it('findTelemetry with no filters queries all documents', async () => {
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry(DEFAULT_QUERY)

    assert.deepEqual(telemetryModel.calls[0], { method: 'find', filter: {} })
  })

  it('findTelemetry with machineId builds correct filter', async () => {
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry({ ...DEFAULT_QUERY, machineId: 'machine-1' })

    assert.deepEqual(telemetryModel.calls[0], {
      method: 'find',
      filter: { machineId: 'machine-1' }
    })
  })

  it('findTelemetry with from/to builds date range filter', async () => {
    const from = new Date('2026-01-01T00:00:00.000Z')
    const to = new Date('2026-06-01T00:00:00.000Z')
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry({ ...DEFAULT_QUERY, from, to })

    assert.deepEqual(telemetryModel.calls[0], {
      method: 'find',
      filter: { capturedAt: { $gte: from, $lte: to } }
    })
  })

  it('findTelemetry sorts descending by capturedAt and _id when sort is desc', async () => {
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry({ ...DEFAULT_QUERY, sort: 'desc' })

    assert.deepEqual(
      telemetryModel.calls.find((c) => c.method === 'sort').sortSpec,
      { capturedAt: -1, _id: -1 }
    )
  })

  it('findTelemetry sorts ascending by capturedAt and _id when sort is asc', async () => {
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry({ ...DEFAULT_QUERY, sort: 'asc' })

    assert.deepEqual(
      telemetryModel.calls.find((c) => c.method === 'sort').sortSpec,
      { capturedAt: 1, _id: 1 }
    )
  })

  it('findTelemetry applies skip and limit', async () => {
    const telemetryModel = createTelemetryModelDouble()
    const repository = createTelemetryRepository({ telemetryModel })

    await repository.findTelemetry({ ...DEFAULT_QUERY, limit: 10, offset: 20 })

    assert.equal(telemetryModel.calls.find((c) => c.method === 'skip').n, 20)
    assert.equal(telemetryModel.calls.find((c) => c.method === 'limit').n, 10)
  })

  it('propagates model errors', async () => {
    const expectedError = new Error('database failure')
    const telemetryModel = createTelemetryModelDouble({
      find() {
        throw expectedError
      }
    })
    const repository = createTelemetryRepository({ telemetryModel })

    await assert.rejects(
      () => repository.findTelemetry(DEFAULT_QUERY),
      expectedError
    )
  })
})
