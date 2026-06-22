import dotenv from 'dotenv'
import type { TelemetryConfig } from '../types/telemetry-config'

dotenv.config()

export type AppConfig = {
  mqtt: {
    url: string
    topic: string
  }
  intervalMs: number
  telemetry: TelemetryConfig
}

export function getConfig(): AppConfig {
  return {
    mqtt: {
      url: process.env.MQTT_URL!,
      topic: process.env.MQTT_TOPIC!
    },
    intervalMs: Number(process.env.INTERVAL_MS!),

    telemetry: {
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
}

export { TelemetryConfig }
