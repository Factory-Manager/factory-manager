import dotenv from 'dotenv'

dotenv.config()

export type NodeEnv = 'development' | 'production'

function toNodeEnv(value?: string): NodeEnv {
  if (value === 'production') return 'production'
  return 'development'
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
  heartbeatTimeoutMs: number
  inboxDbPath: string
}

export function getConfig(): AppConfig {
  return {
    nodeEnv: toNodeEnv(process.env.NODE_ENV),
    mqtt: {
      url: process.env.MQTT_URL!,
      topic: process.env.MQTT_TOPIC!,
      heartbeatTopic: process.env.MQTT_HEARTBEAT_TOPIC!
    },
    intervalMs: Number(process.env.INTERVAL_MS),
    heartbeatIntervalMs: Number(process.env.HEARTBEAT_INTERVAL_MS),
    heartbeatTimeoutMs: Number(process.env.HEARTBEAT_TIMEOUT_MS),
    inboxDbPath: process.env.INBOX_DB_PATH!
  }
}
