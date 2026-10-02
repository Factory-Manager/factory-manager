import { describe, expect, it } from 'vitest'
import { AnomalyDetector } from '@/domain/anomaly/services/anomaly-detector'
import { TemperaturePolicy } from '@/domain/anomaly/services/policies/temperature-policy'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { VibrationPolicy } from '@/domain/anomaly/services/policies/vibration-policy'
import { UUIDGenerator } from '@/infrastructure/adapters/uuid-generator'
import { MachineFactory } from '@/domain/machine/machine-factory'
import { Machine } from '@/domain/machine/machine'

describe('AnomalyDetector', () => {
  const generator = new UUIDGenerator()

  it('should return an empty array when no policies detect anomalies', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy(generator)])

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
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = detector.detect(machine, config)
    expect(anomalies).toHaveLength(0)
  })

  it('should detect an anomaly from a single policy', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy(generator)])

    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
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
    const anomalies = detector.detect(machine, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sensorType: 'operatingTemperature',
          value: machine.temperature.value
        })
      ])
    )
  })

  it('should detect anomalies from multiple policies', () => {
    const detector = new AnomalyDetector([
      new TemperaturePolicy(generator),
      new VibrationPolicy(generator)
    ])

    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.TEMPERATURE.OVER,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.OVER,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      },
      vibration: {
        min: MACHINE_LIMITS.VIBRATION.MIN,
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    const anomalies = detector.detect(machine, config)
    expect(anomalies).toHaveLength(2)
    expect(anomalies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sensorType: 'operatingTemperature',
          value: machine.temperature.value
        }),
        expect.objectContaining({
          sensorType: 'vibration',
          value: machine.vibration.value
        })
      ])
    )
  })

  it('should not detect an anomaly when no policy is defined for the sensor type', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy(generator)])

    const machine: Machine = MachineFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.TEMPERATURE.SAFE,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.OVER,
      MACHINE_VALUES.PRESSURE.SAFE,
      new Date('2025-12-31T23:59:00.000Z'),
      new Date('2026-01-01T00:00:00Z'),
      1
    )
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      },
      vibration: {
        min: MACHINE_LIMITS.VIBRATION.MIN,
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    const anomalies = detector.detect(machine, config)
    expect(anomalies).toHaveLength(0)
  })
})
