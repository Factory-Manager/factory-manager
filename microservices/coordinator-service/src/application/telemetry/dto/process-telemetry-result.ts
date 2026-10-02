import { Machine } from '@/domain/machine/machine'
import { Anomaly } from '../../../domain/anomaly/anomaly'

export type ProcessTelemetryResult = {
  machine: Machine
  anomalies: Anomaly[]
}
