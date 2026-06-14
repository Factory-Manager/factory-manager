import { describe, expect, it } from 'vitest'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { AnomalyEventId } from '@/domain/anomaly/value-objects/anomaly-event-id'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { AnomalyEventIdInvalidError } from '@/domain/anomaly/errors/anomaly-event-id-invalid.error'

describe('Anomaly', () => {
  it('is created with the correct properties', () => {
    const occurredAt = new Date('2025-12-31T23:59:00.000Z')
    const processedAt = new Date('2026-01-01T00:00:00.000Z')
    const anomaly = new Anomaly(
      new AnomalyEventId('A1'),
      new MachineId('M1'),
      SensorType.TEMPERATURE,
      MACHINE_VALUES.TEMPERATURE.OVER,
      occurredAt,
      processedAt
    )
    expect(anomaly.id).toEqual(new AnomalyEventId('A1'))
    expect(anomaly.machineId).toEqual(new MachineId('M1'))
    expect(anomaly.sensorType).toEqual(SensorType.TEMPERATURE)
    expect(anomaly.value).toEqual(MACHINE_VALUES.TEMPERATURE.OVER)
    expect(anomaly.occurredAt).toEqual(occurredAt)
    expect(anomaly.processedAt).toEqual(processedAt)
  })

  it('should throw an error if AnomalyEventId is empty', () => {
    expect(
      () =>
        new Anomaly(
          new AnomalyEventId(''),
          new MachineId('M1'),
          SensorType.TEMPERATURE,
          MACHINE_VALUES.TEMPERATURE.OVER,
          new Date('2025-12-31T23:59:00.000Z'),
          new Date('2026-01-01T00:00:00.000Z')
        )
    ).toThrow(AnomalyEventIdInvalidError)
  })
})
