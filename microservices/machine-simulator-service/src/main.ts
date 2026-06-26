import { getConfig } from './config/env'
import { generateTelemetry } from './generator/telemetry-generator'
import { PinoLogger } from './infrastructure/logger/pino-logger'
import { SystemClock } from './infrastructure/time/system-clock'
import { createMqttClient } from './mqtt/client'

const config = getConfig()
const logger = new PinoLogger()
const clock = new SystemClock()

const mqtt = createMqttClient(config.mqtt.url, logger)

logger.info('simulator started')

const telemetryInterval = setInterval(() => {
  const event = generateTelemetry(config.telemetry, clock)
  const topic = `${config.mqtt.topic}/${config.telemetry.machineId}`

  mqtt.publish(topic, JSON.stringify(event))
  logger.info('published', { event })
}, config.intervalMs)

const heartbeatInterval = setInterval(() => {
  logger.info('simulator heartbeat')
  const heartbeatTopic = `${config.mqtt.heartbeatTopic}/${config.telemetry.machineId}`
  mqtt.publish(
    heartbeatTopic,
    JSON.stringify({ timestamp: clock.now().toISOString() })
  )
}, config.heartbeatIntervalMs)

async function shutdown(signal: string) {
  logger.info('simulator shutting down', { signal })
  clearInterval(telemetryInterval)
  clearInterval(heartbeatInterval)
  await mqtt.close()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
