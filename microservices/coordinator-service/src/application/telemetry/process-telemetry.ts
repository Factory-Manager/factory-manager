import { Machine, MachineConfig, MachineFactory } from '@/domain'
import { AnomalyDetector } from '@/domain/anomaly/services/anomaly-detector'
import { Clock } from '../ports/clock'
import { Logger } from '../ports/logger'
import { ProcessTelemetryResult } from './dto/process-telemetry-result'
import { TelemetryInput } from './dto/telemetry-input'

export class ProcessTelemetry {
  constructor(
    private readonly anomalyDetector: AnomalyDetector,
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  execute(
    input: TelemetryInput,
    machineConfig: MachineConfig
  ): ProcessTelemetryResult {
    const machineId = input.machineId?.trim()
    if (!machineId) throw new Error('Invalid input: machineId is required')
    const occurredAt = new Date(input.occurredAt)
    if (Number.isNaN(occurredAt.getTime())) {
      throw new Error('Invalid input: occurredAt must be a valid date')
    }
    const toFiniteNumber = (raw: string, field: string): number => {
      const n = Number(raw)
      if (!Number.isFinite(n)) {
        throw new Error(`Invalid input: ${field} must be a finite number`)
      }
      return n
    }
    this.logger.info('Processing telemetry data', input)

    const operatingTemperature = toFiniteNumber(
      input.operatingTemperature,
      'operatingTemperature'
    )
    const powerConsumption = toFiniteNumber(
      input.powerConsumption,
      'powerConsumption'
    )
    const emissions = toFiniteNumber(input.emissions, 'emissions')
    const vibration = toFiniteNumber(input.vibration, 'vibration')
    const pressure = toFiniteNumber(input.pressure, 'pressure')

    const machine: Machine = MachineFactory.create(
      machineId,
      operatingTemperature,
      powerConsumption,
      emissions,
      vibration,
      pressure,
      occurredAt,
      this.clock.now(),
      input.sequenceNumber
    )

    const anomalies = this.anomalyDetector.detect(machine, machineConfig)
    if (anomalies.length > 0) {
      this.logger.warn('Anomalies detected', {
        machineId: machine.id.value,
        anomalies
      })
    } else {
      this.logger.info('No anomalies detected', { machineId: machine.id.value })
    }

    this.logger.info('Processed telemetry event', { machine: machine })

    return { machine, anomalies }
  }
}
