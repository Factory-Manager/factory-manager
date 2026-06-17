import { MACHINE_STATES } from '#src/domain/machines/machine.states.js'
import { SENSOR_TYPES } from '#src/domain/machines/sensor.types.js'

export const MACHINE_TEST_VALUES = Object.freeze({
  serial: 'MCH-001',
  name: 'Press Alpha',
  areaId: 'a'.repeat(24),
  invalidAreaId: 'not-an-objectid',
  invalidState: 'flying',
  invalidSensorType: 'gravity'
})

const VALID_SPECIFICATIONS = Object.freeze({
  powerConsumption: {
    measurementUnit: 'kW',
    normalRange: { min: 0, max: 100 }
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
})

export function createValidMachineData(overrides = {}) {
  return {
    serial: MACHINE_TEST_VALUES.serial,
    name: MACHINE_TEST_VALUES.name,
    location: { areaId: MACHINE_TEST_VALUES.areaId },
    machineState: {
      currentState: MACHINE_STATES.OFF,
      anomalyDetails: []
    },
    specifications: VALID_SPECIFICATIONS,
    ...overrides
  }
}

export function createValidCreateMachineInput(overrides = {}) {
  return {
    serial: MACHINE_TEST_VALUES.serial,
    name: MACHINE_TEST_VALUES.name,
    location: { areaId: MACHINE_TEST_VALUES.areaId },
    specifications: VALID_SPECIFICATIONS,
    ...overrides
  }
}

export function createValidAnomalyStateInput(overrides = {}) {
  return {
    currentState: MACHINE_STATES.ANOMALY,
    anomalyDetails: [SENSOR_TYPES.VIBRATION, SENSOR_TYPES.PRESSURE],
    ...overrides
  }
}
