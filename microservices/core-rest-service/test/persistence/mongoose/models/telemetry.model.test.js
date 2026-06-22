import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { TelemetryModel } from '#src/persistence/mongoose/models/telemetry.model.js'
import {
  TELEMETRY_TEST_VALUES,
  createValidTelemetryData
} from '#test/factories/telemetry.js'

function createTelemetry(overrides = {}) {
  return new TelemetryModel(createValidTelemetryData(overrides))
}

describe('Telemetry model', () => {
  it('creates a valid telemetry document', () => {
    const record = createTelemetry()
    const error = record.validateSync()

    assert.equal(error, undefined)
    assert.equal(record.eventId, TELEMETRY_TEST_VALUES.eventId)
    assert.equal(record.sequenceNumber, TELEMETRY_TEST_VALUES.sequenceNumber)
  })

  it('requires eventId, machineId, sequenceNumber, capturedAt', () => {
    const cases = [
      ['eventId', { eventId: undefined }],
      ['machineId', { machineId: undefined }],
      ['sequenceNumber', { sequenceNumber: undefined }],
      ['capturedAt', { capturedAt: undefined }]
    ]

    for (const [field, overrides] of cases) {
      const error = createTelemetry(overrides).validateSync()
      assert.ok(error?.errors[field], `expected validation error for ${field}`)
    }
  })

  it('requires all five readings', () => {
    const fields = [
      'powerConsumption',
      'emissions',
      'operatingTemperature',
      'vibration',
      'pressure'
    ]

    for (const field of fields) {
      const readings = {
        ...createValidTelemetryData().readings,
        [field]: undefined
      }
      const error = createTelemetry({ readings }).validateSync()
      assert.ok(
        error?.errors[`readings.${field}`],
        `expected validation error for readings.${field}`
      )
    }
  })

  it('requires anomaly.isAnomaly', () => {
    const record = createTelemetry({
      anomaly: { details: [] }
    })
    const error = record.validateSync()

    assert.ok(error?.errors['anomaly.isAnomaly'])
  })

  it('rejects sequenceNumber less than 0', () => {
    const record = createTelemetry({ sequenceNumber: -1 })
    const error = record.validateSync()

    assert.ok(error?.errors['sequenceNumber'])
  })

  it('rejects invalid sensor type in anomaly.details', () => {
    const record = createTelemetry({
      anomaly: { isAnomaly: true, details: ['invalid-sensor'] }
    })
    const error = record.validateSync()

    assert.ok(error?.errors['anomaly.details.0'])
  })

  it('trims whitespace from eventId', () => {
    const record = createTelemetry({ eventId: '  evt-padded  ' })

    assert.equal(record.eventId, 'evt-padded')
  })

  it('defines a unique index on eventId', () => {
    const indexes = TelemetryModel.schema.indexes()

    assert.ok(
      indexes.some(([fields, options]) => {
        return fields.eventId === 1 && options.unique === true
      })
    )
  })

  it('defines a compound index on machineId and capturedAt', () => {
    const indexes = TelemetryModel.schema.indexes()

    assert.ok(
      indexes.some(([fields]) => {
        return fields.machineId === 1 && fields.capturedAt === -1
      })
    )
  })
})
