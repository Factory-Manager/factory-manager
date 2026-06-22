export type TelemetryConfig = {
  machineId: string
  operatingTemperature: { min: number; max: number }
  powerConsumption: { min: number; max: number }
  emissions: { min: number; max: number }
  vibration: { min: number; max: number }
  pressure: { min: number; max: number }
}
