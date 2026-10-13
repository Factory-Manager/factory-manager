import { describe, expect, it } from 'vitest'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { TelemetryFactory } from '@/domain/machine/telemetry-factory'

describe('TelemetryFactory', () => {
  it('should create telemetry from sensor data', () => {
    const telemetry = TelemetryFactory.create(
      MACHINE_VALUES.ID,
      MACHINE_VALUES.EVENT_ID,
      MACHINE_VALUES.TEMPERATURE.SAFE,
      MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      MACHINE_VALUES.EMISSION.SAFE,
      MACHINE_VALUES.VIBRATION.SAFE,
      MACHINE_VALUES.PRESSURE.SAFE,
      MACHINE_VALUES.OCCURRED_AT,
      MACHINE_VALUES.PROCESSED_AT,
      MACHINE_VALUES.SEQUENCE_NUMBER
    )

    expect(telemetry).toMatchObject({
      id: expect.objectContaining({ value: MACHINE_VALUES.ID }),
      eventId: expect.objectContaining({ value: MACHINE_VALUES.EVENT_ID }),
      temperature: expect.objectContaining({
        value: MACHINE_VALUES.TEMPERATURE.SAFE
      }),
      powerConsumption: expect.objectContaining({
        value: MACHINE_VALUES.POWER_CONSUMPTION.SAFE
      }),
      emissions: expect.objectContaining({
        value: MACHINE_VALUES.EMISSION.SAFE
      }),
      vibration: expect.objectContaining({
        value: MACHINE_VALUES.VIBRATION.SAFE
      }),
      pressure: expect.objectContaining({
        value: MACHINE_VALUES.PRESSURE.SAFE
      })
    })
  })
})
