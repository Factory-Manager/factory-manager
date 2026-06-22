import { getConfig } from './config/env'
import { generateTelemetry } from './generator/telemetry-generator'
import { PinoLogger } from './infrastructure/logger/pino-logger'
import { createMqttClient } from './mqtt/client'

const config = getConfig()
const logger = new PinoLogger()

const mqtt = createMqttClient(config.mqtt.url, logger)

logger.info('simulator started')

setInterval(() => {
  const event = generateTelemetry(config.telemetry)
  const topic = `${config.mqtt.topic}/${config.telemetry.machineId}`
  mqtt.publish(topic, JSON.stringify(event))

  logger.info('published', { event })
}, config.intervalMs)

process.on('SIGINT', () => {
  logger.info('simulator shutting down')
  mqtt.close()
  process.exit(0)
})
