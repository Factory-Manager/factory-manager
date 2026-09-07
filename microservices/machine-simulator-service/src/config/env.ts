import dotenv from 'dotenv'
import type { AnomalyType, TelemetryConfig } from '../types/telemetry-config'

dotenv.config()

export type NodeEnv = 'development' | 'production'

function toNodeEnv(value?: string): NodeEnv {
  if (value === 'production') return 'production'
  return 'development'
}

function parseAnomalies(value?: string): AnomalyType[] {
  if (!value) return []

  const validAnomalies: AnomalyType[] = [
    'temperature',
    'vibration',
    'pressure',
    'powerConsumption',
    'emissions'
  ]

  const anomalies = value
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  for (const anomaly of anomalies) {
    if (!validAnomalies.includes(anomaly as AnomalyType)) {
      throw new Error(`Invalid anomaly type: ${anomaly}`)
    }
  }
  return anomalies as AnomalyType[]
}

export type AppConfig = {
  nodeEnv: NodeEnv
  mqtt: {
    url: string
    topic: string
    heartbeatTopic: string
  }
  intervalMs: number
  heartbeatIntervalMs: number
  outboxDbPath: string
  telemetry: TelemetryConfig
}

export function getConfig(): AppConfig {
  return {
    nodeEnv: toNodeEnv(process.env.NODE_ENV),
    mqtt: {
      url: process.env.MQTT_URL!,
      topic: process.env.MQTT_TOPIC!,
      heartbeatTopic: process.env.MQTT_HEARTBEAT_TOPIC!
    },
    intervalMs: Number(process.env.INTERVAL_MS!),
    heartbeatIntervalMs: Number(process.env.HEARTBEAT_INTERVAL_MS!),
    outboxDbPath: process.env.OUTBOX_DB_PATH!,
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
      },

      anomalies: parseAnomalies(process.env.ANOMALIES)
    }
  }
}

export type { TelemetryConfig }
