import { describe, it, expect, beforeAll } from 'vitest'
import { generateTelemetry } from '../../src/generator/telemetry-generator'
import { TelemetryEvent } from '../../src/types/telemetry-event'
import { MACHINE_LIMITS } from '../constants/machine-limits'

describe('generateTelemetry', () => {
  const testConfig = {
    machineId: 'machine-1',
    operatingTemperature: {
      min: MACHINE_LIMITS.OPERATING_TEMPERATURE.MIN,
      max: MACHINE_LIMITS.OPERATING_TEMPERATURE.MAX
    },
    vibration: {
      min: MACHINE_LIMITS.VIBRATION.MIN,
      max: MACHINE_LIMITS.VIBRATION.MAX
    },
    powerConsumption: {
      min: MACHINE_LIMITS.POWER_CONSUMPTION.MIN,
      max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
    },
    emissions: {
      min: MACHINE_LIMITS.EMISSIONS.MIN,
      max: MACHINE_LIMITS.EMISSIONS.MAX
    },
    pressure: {
      min: MACHINE_LIMITS.PRESSURE.MIN,
      max: MACHINE_LIMITS.PRESSURE.MAX
    }
  }

  it('should generate telemetry with correct structure', () => {
    const telemetryEvent: TelemetryEvent = generateTelemetry(testConfig)
    expect(telemetryEvent).toHaveProperty('machineId')
    expect(telemetryEvent).toHaveProperty('occurredAt')
    expect(telemetryEvent).toHaveProperty('operatingTemperature')
    expect(telemetryEvent).toHaveProperty('vibration')
    expect(telemetryEvent).toHaveProperty('powerConsumption')
    expect(telemetryEvent).toHaveProperty('emissions')
    expect(telemetryEvent).toHaveProperty('pressure')
  })

  it('should generate telemetry with valid values', () => {
    const telemetryEvent: TelemetryEvent = generateTelemetry(testConfig)
    expect(telemetryEvent.operatingTemperature).toBeGreaterThanOrEqual(
      testConfig.operatingTemperature.min
    )
    expect(telemetryEvent.operatingTemperature).toBeLessThanOrEqual(
      testConfig.operatingTemperature.max
    )
    expect(telemetryEvent.vibration).toBeGreaterThanOrEqual(
      testConfig.vibration.min
    )
    expect(telemetryEvent.vibration).toBeLessThanOrEqual(
      testConfig.vibration.max
    )
    expect(telemetryEvent.powerConsumption).toBeGreaterThanOrEqual(
      testConfig.powerConsumption.min
    )
    expect(telemetryEvent.powerConsumption).toBeLessThanOrEqual(
      testConfig.powerConsumption.max
    )
    expect(telemetryEvent.emissions).toBeGreaterThanOrEqual(
      testConfig.emissions.min
    )
    expect(telemetryEvent.emissions).toBeLessThanOrEqual(
      testConfig.emissions.max
    )
    expect(telemetryEvent.pressure).toBeGreaterThanOrEqual(
      testConfig.pressure.min
    )
    expect(telemetryEvent.pressure).toBeLessThanOrEqual(testConfig.pressure.max)
  })
})
