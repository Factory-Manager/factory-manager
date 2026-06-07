import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '@/domain/anomaly/anomaly'

export interface AnomalyPolicy {
  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[]
}
