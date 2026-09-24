import { TelemetryDto } from '../dto/telemetry.dto'
import { ProcessTelemetryResult } from '@/application/telemetry/dto/process-telemetry-result'

export function toTelemetryDto(
  telemetryData: ProcessTelemetryResult
): TelemetryDto {
  return {
    eventId: telemetryData.event.eventId,
    machineId: telemetryData.event.machineId,
    sequenceNumber: telemetryData.event.sequenceNumber,
    capturedAt: telemetryData.event.occurredAt.toISOString(),
    readings: {
      powerConsumption: telemetryData.event.powerConsumption,
      emissions: telemetryData.event.emissions,
      operatingTemperature: telemetryData.event.operatingTemperature,
      vibration: telemetryData.event.vibration,
      pressure: telemetryData.event.pressure
    },
    anomaly: {
      isAnomaly: telemetryData.anomalies.length > 0,
      details: telemetryData.anomalies.map((anomaly) => anomaly.sensorType)
    }
  }
}
