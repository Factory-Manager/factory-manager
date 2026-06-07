import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '../anomaly'
import { AnomalyPolicy } from './policies/anomaly-policy'

export class AnomalyDetector {
  constructor(private readonly policies: AnomalyPolicy[]) {}

  detect(event: TelemetryEvent, config: MachineConfig): Anomaly[] {
    return this.policies.flatMap((p) => p.evaluate(event, config))
  }
}
