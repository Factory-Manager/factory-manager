import { describe, expect, it } from 'vitest'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { PowerConsumptionPolicy } from '@/domain/anomaly/services/policies/power-consumption-policy'
import { UUIDGenerator } from '@/infrastructure/adapters/uuid-generator'
import { MachineFactory } from '@/domain/machine/machine-factory'
import { Machine } from '@/domain/machine/machine'

describe('PowerConsumptionPolicy', () => {
  const generator = new UUIDGenerator()

  it('should return an anomaly with correct details when power consumption is over the maximum limit', () => {
    const policy = new PowerConsumptionPolicy(generator)
    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.TEMPERATURE.SAFE,
      MACHINE_VALUES.POWER_CONSUMPTION.OVER,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      powerConsumption: {
        min: MACHINE_LIMITS.POWER_CONSUMPTION.MIN,
        max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].sensorType).toBe(SensorType.POWER_CONSUMPTION)
    expect(anomalies[0].value).toBe(machine.powerConsumption.value)
  })

  it('should not detect any anomaly when power consumption is within limits', () => {
    const policy = new PowerConsumptionPolicy(generator)
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
      powerConsumption: {
        min: MACHINE_LIMITS.POWER_CONSUMPTION.MIN,
        max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
      }
    })
    const anomalies = policy.evaluate(machine, config)
    expect(anomalies).toHaveLength(0)
  })
})
