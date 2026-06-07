export type TelemetryEvent = {
  machineId: string
  occurredAt: Date
  processedAt: Date
  operatingTemperature: number
  powerConsumption: number
  emissions: number
  vibration: number
  pressure: number
}
