export type TelemetryRanges = {
  operatingTemperature: { min: number; max: number }
  powerConsumption: { min: number; max: number }
  emissions: { min: number; max: number }
  vibration: { min: number; max: number }
  pressure: { min: number; max: number }
}

export type AnomalyType = keyof TelemetryRanges

export type TelemetryConfig = {
  machineId: string
  anomalies: AnomalyType[]
} & TelemetryRanges
