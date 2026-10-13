import { TelemetryEvent } from '@/domain/machine/telemetry'
import { Anomaly } from '../../../domain/anomaly/anomaly'

export type ProcessTelemetryResult = {
  machine: TelemetryEvent
  anomalies: Anomaly[]
}
