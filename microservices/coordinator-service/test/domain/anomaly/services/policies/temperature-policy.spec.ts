import { describe, expect, it } from 'vitest'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { TemperaturePolicy } from '@/domain/anomaly/services/policies/temperature-policy'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { TelemetryFactory } from '@/domain/machine/telemetry-factory'
import { TelemetryEvent } from '@/domain/machine/telemetry'
import { UUIDGenerator } from '@/infrastructure/adapters/uuid-generator'

describe('TemperaturePolicy', () => {
  const generator = new UUIDGenerator()

  it('should return an anomaly with correct details when temperature is over the maximum limit', () => {
    const policy = new TemperaturePolicy(generator)
    const machine: TelemetryEvent = TelemetryFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.EVENT_ID,
      MACHINE_VALUES.TEMPERATURE.OVER,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].sensorType).toBe(SensorType.TEMPERATURE)
    expect(anomalies[0].value).toBe(machine.temperature.value)
  })

  it('should detect temperature anomalies under the minimum limit', () => {
    const policy = new TemperaturePolicy(generator)
    const machine: TelemetryEvent = TelemetryFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.EVENT_ID,
      MACHINE_VALUES.TEMPERATURE.UNDER,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].sensorType).toBe(SensorType.TEMPERATURE)
    expect(anomalies[0].value).toBe(machine.temperature.value)
  })

  it('should not detect any anomaly when temperature is within limits', () => {
    const policy = new TemperaturePolicy(generator)
    const machine: TelemetryEvent = TelemetryFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.EVENT_ID,
      MACHINE_VALUES.TEMPERATURE.SAFE,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(0)
  })
})
