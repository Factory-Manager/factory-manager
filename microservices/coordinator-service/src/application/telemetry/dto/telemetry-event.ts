export type TelemetryEvent = {
  eventId: string
  machineId: string
  sequenceNumber: number
  occurredAt: Date
  processedAt: Date
  operatingTemperature: number
  powerConsumption: number
  emissions: number
  vibration: number
  pressure: number
}
