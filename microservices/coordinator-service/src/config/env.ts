import dotenv from 'dotenv'

dotenv.config()

export type AppConfig = {
  mqtt: {
    url: string
    topic: string
    heartbeatTopic: string
  }
  intervalMs: number
  heartbeatIntervalMs: number
}

export function getConfig(): AppConfig {
  return {
    mqtt: {
      url: process.env.MQTT_URL!,
      topic: process.env.MQTT_TOPIC!,
      heartbeatTopic: process.env.MQTT_HEARTBEAT_TOPIC!
    },
    intervalMs: Number(process.env.INTERVAL_MS),
    heartbeatIntervalMs: Number(process.env.HEARTBEAT_INTERVAL_MS)
  }
}
