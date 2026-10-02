import { describe, expect, it } from 'vitest'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { EmissionPolicy } from '@/domain/anomaly/services/policies/emission-policy'
import { UUIDGenerator } from '@/infrastructure/adapters/uuid-generator'
import { MachineFactory } from '@/domain/machine/machine-factory'
import { Machine } from '@/domain/machine/machine'

describe('EmissionPolicy', () => {
  const generator = new UUIDGenerator()

  it('should return an anomaly with correct details when emission is over the maximum limit', () => {
    const policy = new EmissionPolicy(generator)
    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.TEMPERATURE.SAFE,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.OVER,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      emissions: {
        min: MACHINE_LIMITS.EMISSION.MIN,
        max: MACHINE_LIMITS.EMISSION.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].sensorType).toBe(SensorType.EMISSIONS)
    expect(anomalies[0].value).toBe(machine.emissions.value)
  })

  it('should not detect any anomaly when emissions is within limits', () => {
    const policy = new EmissionPolicy(generator)
    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
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
      emissions: {
        min: MACHINE_LIMITS.EMISSION.MIN,
        max: MACHINE_LIMITS.EMISSION.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(0)
  })
})
