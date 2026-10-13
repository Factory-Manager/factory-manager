export interface TelemetryDto {
  eventId: string
  machineId: string
  sequenceNumber: number
  capturedAt: string
  readings: {
    powerConsumption: number
    emissions: number
    operatingTemperature: number
    vibration: number
    pressure: number
  }
  anomaly: {
    isAnomaly: boolean
    details: string[]
  }
}
