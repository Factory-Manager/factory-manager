import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { Machine } from '@/domain'

export interface AnomalyPolicy {
  evaluate(event: Machine, config: MachineConfig): Anomaly[]
}
