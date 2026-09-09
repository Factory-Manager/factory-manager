import { describe, expect, it } from 'vitest'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { fakeConfig } from '@test/utils/fake-config'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { VibrationPolicy } from '@/domain/anomaly/services/policies/vibration-policy'

describe('VibrationPolicy', () => {
  it('should return an anomaly with correct details when vibration is over the maximum limit', () => {
    const policy = new VibrationPolicy()
    const event: TelemetryEvent = {
      eventId: 'test-event-id',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00.000Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.OVER,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
    const config: MachineConfig = fakeConfig({
      vibration: {
        min: MACHINE_LIMITS.VIBRATION.MIN,
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    const anomalies = policy.evaluate(event, config)
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].sensorType).toBe(SensorType.VIBRATION)
    expect(anomalies[0].value).toBe(event.vibration)
  })

  it('should not detect any anomaly when vibration is within limits', () => {
    const policy = new VibrationPolicy()
    const event: TelemetryEvent = {
      eventId: 'test-event-id',
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: new Date('2025-12-31T23:59:00.000Z'),
      processedAt: new Date('2026-01-01T00:00:00.000Z'),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.SAFE,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    }
    const config: MachineConfig = fakeConfig({
      vibration: {
        min: MACHINE_LIMITS.VIBRATION.MIN,
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    const anomalies = policy.evaluate(event, config)
    expect(anomalies).toHaveLength(0)
  })
})
