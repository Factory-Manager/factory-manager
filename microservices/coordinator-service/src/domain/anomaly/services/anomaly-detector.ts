import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '../anomaly'
import { AnomalyPolicy } from './policies/anomaly-policy'
import { Machine } from '@/domain/machine/machine'

export class AnomalyDetector {
  constructor(private readonly policies: AnomalyPolicy[]) {}

  detect(event: Machine, config: MachineConfig): Anomaly[] {
    return this.policies.flatMap((p) => p.evaluate(event, config))
  }
}
