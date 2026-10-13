import { TelemetryDto } from '../dto/telemetry.dto'
import { ProcessTelemetryResult } from '@/application/telemetry/dto/process-telemetry-result'

export function toTelemetryDto(
  telemetryData: ProcessTelemetryResult
): TelemetryDto {
  return {
    eventId: telemetryData.machine.eventId.value,
    machineId: telemetryData.machine.id.value,
    sequenceNumber: telemetryData.machine.sequenceNumber,
    capturedAt: telemetryData.machine.occurredAt.toISOString(),
    readings: {
      powerConsumption: telemetryData.machine.powerConsumption.value,
      emissions: telemetryData.machine.emissions.value,
      operatingTemperature: telemetryData.machine.temperature.value,
      vibration: telemetryData.machine.vibration.value,
      pressure: telemetryData.machine.pressure.value
    },
    anomaly: {
      isAnomaly: telemetryData.anomalies.length > 0,
      details: telemetryData.anomalies.map((anomaly) => anomaly.sensorType)
    }
  }
}
