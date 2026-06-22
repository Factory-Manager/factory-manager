import { SENSOR_TYPES } from '#src/domain/machines/sensor.types.js'

export const TELEMETRY_TEST_VALUES = Object.freeze({
  eventId: 'evt-test-001',
  machineId: 'a'.repeat(24),
  sequenceNumber: 1,
  capturedAt: '2026-06-06T12:30:00.000Z'
})

const VALID_READINGS = Object.freeze({
  powerConsumption: 42.5,
  emissions: 12.3,
  operatingTemperature: 76.2,
  vibration: 3.1,
  pressure: 2.4
})

export function createValidTelemetryData(overrides = {}) {
  return {
    eventId: TELEMETRY_TEST_VALUES.eventId,
    machineId: TELEMETRY_TEST_VALUES.machineId,
    sequenceNumber: TELEMETRY_TEST_VALUES.sequenceNumber,
    capturedAt: new Date(TELEMETRY_TEST_VALUES.capturedAt),
    readings: { ...VALID_READINGS },
    anomaly: { isAnomaly: false, details: [] },
    ...overrides
  }
}

export function createValidCreateTelemetryInput(overrides = {}) {
  return {
    eventId: TELEMETRY_TEST_VALUES.eventId,
    machineId: TELEMETRY_TEST_VALUES.machineId,
    sequenceNumber: TELEMETRY_TEST_VALUES.sequenceNumber,
    capturedAt: TELEMETRY_TEST_VALUES.capturedAt,
    readings: { ...VALID_READINGS },
    anomaly: { isAnomaly: false, details: [] },
    ...overrides
  }
}

export function createAnomalyTelemetryInput(overrides = {}) {
  return createValidCreateTelemetryInput({
    anomaly: {
      isAnomaly: true,
      details: [SENSOR_TYPES.VIBRATION, SENSOR_TYPES.PRESSURE]
    },
    ...overrides
  })
}
