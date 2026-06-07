import { MachineConfig } from '../../domain'
import { AnomalyDetector } from '../../domain/anomaly/services/anomaly-detector'
import { Logger } from '../ports/logger'
import { ProcessTelemetryResult } from './dto/process-telemetry-result'
import { TelemetryEvent } from './dto/telemetry-event'
import { TelemetryInput } from './dto/telemetry-input'

export class ProcessTelemetry {
  constructor(
    private readonly anomalyDetector: AnomalyDetector,
    private readonly logger: Logger
  ) {}

  execute(
    input: TelemetryInput,
    machineConfig: MachineConfig
  ): ProcessTelemetryResult {
    if (!input.machineId) throw new Error('Invalid input')
    this.logger.info('Processing telemetry data', input)

    const event: TelemetryEvent = {
      machineId: input.machineId,
      occurredAt: new Date(input.occurredAt),
      operatingTemperature: Number(input.operatingTemperature),
      powerConsumption: Number(input.powerConsumption),
      emissions: Number(input.emissions),
      vibration: Number(input.vibration),
      pressure: Number(input.pressure)
    }

    const anomalies = this.anomalyDetector.detect(event, machineConfig)
    if (anomalies.length > 0) {
      this.logger.warn('Anomalies detected', {
        machineId: event.machineId,
        anomalies
      })
    } else {
      this.logger.info('No anomalies detected', { machineId: event.machineId })
    }

    this.logger.info('Processed telemetry event', { event })

    return { event, anomalies }
  }
}
