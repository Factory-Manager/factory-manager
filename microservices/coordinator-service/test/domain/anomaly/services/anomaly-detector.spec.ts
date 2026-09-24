import { describe, expect, it } from 'vitest'
import { AnomalyDetector } from '@/domain/anomaly/services/anomaly-detector'
import { TemperaturePolicy } from '@/domain/anomaly/services/policies/temperature-policy'
import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { VibrationPolicy } from '@/domain/anomaly/services/policies/vibration-policy'

describe('AnomalyDetector', () => {
  it('should return an empty array when no policies detect anomalies', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy()])
    const event: TelemetryEvent = {
      eventId: 'event-1',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: 1,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.SAFE,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = detector.detect(event, config)
    expect(anomalies).toHaveLength(0)
  })

  it('should detect an anomaly from a single policy', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy()])

    const event: TelemetryEvent = {
      eventId: 'event-1',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: 1,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.OVER,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.SAFE,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN,
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    const anomalies = detector.detect(event, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sensorType: 'operatingTemperature',
          value: event.operatingTemperature
        })
      ])
    )
  })

  it('should detect anomalies from multiple policies', () => {
    const detector = new AnomalyDetector([
      new TemperaturePolicy(),
      new VibrationPolicy()
    ])

    const event: TelemetryEvent = {
      eventId: 'event-1',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: 1,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.OVER,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.OVER,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
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
    const anomalies = detector.detect(event, config)
    expect(anomalies).toHaveLength(2)
    expect(anomalies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sensorType: 'operatingTemperature',
          value: event.operatingTemperature
        }),
        expect.objectContaining({
          sensorType: 'vibration',
          value: event.vibration
        })
      ])
    )
  })

  it('should not detect an anomaly when no policy is defined for the sensor type', () => {
    const detector = new AnomalyDetector([new TemperaturePolicy()])

    const event: TelemetryEvent = {
      eventId: 'event-1',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: 1,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.OVER,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
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
    const anomalies = detector.detect(event, config)
    expect(anomalies).toHaveLength(0)
  })
})
