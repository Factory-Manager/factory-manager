import { TelemetryEvent } from '../../../../application/telemetry/dto/telemetry-event'
import { MachineConfig } from '../../../machine/machine-config'
import { Anomaly } from '../../anomaly'

export interface AnomalyPolicy {
  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[]
}
