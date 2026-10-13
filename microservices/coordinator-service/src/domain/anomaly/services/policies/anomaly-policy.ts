import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { TelemetryEvent } from '@/domain'

export interface AnomalyPolicy {
  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[]
}
