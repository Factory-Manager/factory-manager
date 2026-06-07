import { Anomaly } from '../../../domain/anomaly/anomaly'
import { TelemetryEvent } from './telemetry-event'

export type ProcessTelemetryResult = {
  event: TelemetryEvent
  anomalies: Anomaly[]
}
