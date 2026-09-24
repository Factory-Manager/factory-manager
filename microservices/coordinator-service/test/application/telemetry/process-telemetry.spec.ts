import { describe, it, expect } from 'vitest'
import { createAnomalyDetectorMock } from '@test/mocks/anomaly-detector.mock'
import { createLoggerMock } from '@test/mocks/logger.mock'
import { fakeConfig } from '@test/utils/fake-config'
import { ProcessTelemetry } from '@/application/telemetry/process-telemetry'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { TelemetryInput } from '@/application/telemetry/dto/telemetry-input'

describe('ProcessTelemetry', () => {
  const occurredAtDate: Date = new Date('2025-12-31T23:59:00.000Z')
  const processedAtDate: Date = new Date('2026-01-01T00:00:00.000Z')

  it('should process telemetry correctly', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()
    detector.detect.mockReturnValue([])
    const fakeClock = { now: () => new Date('2026-01-01T00:00:00Z') }

    const useCase = new ProcessTelemetry(
      detector as any,
      fakeClock,
      logger as any
    )

    const input: TelemetryInput = {
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: occurredAtDate.toISOString(),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE.toString(),
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    const result = useCase.execute(input, fakeConfig())

    expect(result.event.machineId).toBe(MACHINE_VALUES.ID)
    expect(result.event.operatingTemperature).toBe(
      MACHINE_VALUES.TEMPERATURE.SAFE
    )
    expect(result.anomalies).toHaveLength(0)
  })

  it('should detect anomalies', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()
    detector.detect.mockReturnValue([
      {
        sensorType: SensorType.TEMPERATURE,
        value: MACHINE_VALUES.TEMPERATURE.OVER,
        processedAt: processedAtDate
      }
    ])
    const fakeClock = { now: () => processedAtDate }

    const useCase = new ProcessTelemetry(
      detector as any,
      fakeClock,
      logger as any
    )

    const input: TelemetryInput = {
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: occurredAtDate.toISOString(),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.OVER.toString(),
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    const result = useCase.execute(input, fakeConfig())

    expect(result.event.machineId).toBe(MACHINE_VALUES.ID)
    expect(result.event.operatingTemperature).toBe(
      MACHINE_VALUES.TEMPERATURE.OVER
    )
    expect(result.event.occurredAt).toEqual(occurredAtDate)
    expect(result.event.processedAt).toEqual(processedAtDate)
    expect(result.anomalies).toHaveLength(1)
    expect(result.anomalies[0].sensorType).toBe(SensorType.TEMPERATURE)
    expect(result.anomalies[0].value).toBe(MACHINE_VALUES.TEMPERATURE.OVER)
    expect(result.anomalies[0].processedAt).toEqual(processedAtDate)
    expect(detector.detect).toHaveBeenCalledTimes(1)
  })

  it('should throw error for invalid input', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()
    const fakeClock = { now: () => processedAtDate }

    const useCase = new ProcessTelemetry(
      detector as any,
      fakeClock,
      logger as any
    )

    const input: TelemetryInput = {
      machineId: '',
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: occurredAtDate.toISOString(),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE.toString(),
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    expect(() => useCase.execute(input, fakeConfig())).toThrow(Error)
  })

  it('should throw error for invalid date', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()
    const fakeClock = { now: () => processedAtDate }

    const useCase = new ProcessTelemetry(
      detector as any,
      fakeClock,
      logger as any
    )

    const input: TelemetryInput = {
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: 'invalid-date',
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE.toString(),
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    expect(() => useCase.execute(input, fakeConfig())).toThrow(Error)
  })

  it('should throw error for non-finite numbers', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()
    const fakeClock = { now: () => processedAtDate }

    const useCase = new ProcessTelemetry(
      detector as any,
      fakeClock,
      logger as any
    )

    const input: TelemetryInput = {
      machineId: MACHINE_VALUES.ID,
      sequenceNumber: MACHINE_VALUES.SEQUENCE_NUMBER,
      occurredAt: occurredAtDate.toISOString(),
      operatingTemperature: 'NaN',
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    expect(() => useCase.execute(input, fakeConfig())).toThrow(Error)
  })
})
