import { describe, it, expect } from 'vitest'
import { createAnomalyDetectorMock } from '../../mocks/anomaly-detector.mock'
import { createLoggerMock } from '../../mocks/logger.mock'
import { fakeConfig } from '../../utils/fake-config'
import { ProcessTelemetry } from '../../../src/application/telemetry/process-telemetry'
import { MACHINE_VALUES } from '../../constants/machine-values'


describe('ProcessTelemetry', () => {
  it('should process telemetry correctly', () => {
    const logger = createLoggerMock()
    const detector = createAnomalyDetectorMock()

    const useCase = new ProcessTelemetry(detector as any, logger as any)

    const input = {
      machineId: MACHINE_VALUES.ID,
      occurredAt: new Date().toISOString(),
      operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE.toString(),
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE.toString(),
      emissions: MACHINE_VALUES.EMISSION.SAFE.toString(),
      vibration: MACHINE_VALUES.VIBRATION.SAFE.toString(),
      pressure: MACHINE_VALUES.PRESSURE.SAFE.toString()
    }

    const result = useCase.execute(input, fakeConfig())

    expect(result.event.machineId).toBe(MACHINE_VALUES.ID)
    expect(result.event.operatingTemperature).toBe(MACHINE_VALUES.TEMPERATURE.SAFE)
    expect(result.anomalies).toHaveLength(0)
    expect(detector.detect).toHaveBeenCalledTimes(1)
  })
})