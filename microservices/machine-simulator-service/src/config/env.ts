export type TelemetryConfig = {
  machineId: string
  operatingTemperature: { min: number; max: number }
  powerConsumption: { min: number; max: number }
  emissions: { min: number; max: number }
  vibration: { min: number; max: number }
  pressure: { min: number; max: number }
}

export function getConfig(): TelemetryConfig {
  return {
    machineId: process.env.MACHINE_ID!,

    operatingTemperature: {
      min: Number(process.env.OPERATING_TEMPERATURE_MIN!),
      max: Number(process.env.OPERATING_TEMPERATURE_MAX!)
    },

    powerConsumption: {
      min: Number(process.env.POWER_CONSUMPTION_MIN!),
      max: Number(process.env.POWER_CONSUMPTION_MAX!)
    },

    emissions: {
      min: Number(process.env.EMISSIONS_MIN!),
      max: Number(process.env.EMISSIONS_MAX!)
    },

    vibration: {
      min: Number(process.env.VIBRATION_MIN!),
      max: Number(process.env.VIBRATION_MAX!)
    },

    pressure: {
      min: Number(process.env.PRESSURE_MIN!),
      max: Number(process.env.PRESSURE_MAX!)
    }
  }
}
