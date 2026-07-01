import { randomUUID } from 'crypto'
import { getConfig } from './config/env'
import { generateTelemetry } from './generator/telemetry-generator'
import { PinoLogger } from './infrastructure/logger/pino-logger'
import { createSqliteDatabase } from './infrastructure/persistence/sqlite/create-sqlite-database'
import { SqliteOutboxRepository } from './infrastructure/persistence/sqlite/sqlite-outbox.repository'
import { SystemClock } from './infrastructure/time/system-clock'
import { createMqttClient } from './mqtt/client'
import { OutboxMessage, OutboxStatus } from './messaging/outbox/outbox-message'
import { TelemetryEvent } from './types/telemetry-event'

const config = getConfig()
const logger = new PinoLogger(config.nodeEnv)
const clock = new SystemClock()

const mqtt = createMqttClient(config.mqtt.url, logger)
const db = createSqliteDatabase(config.outboxDbPath)
const outbox = new SqliteOutboxRepository(db)

logger.info('simulator started')

const telemetryInterval = setInterval(async () => {
  const event: TelemetryEvent = generateTelemetry(config.telemetry, clock)
  const topic = `${config.mqtt.topic}/${config.telemetry.machineId}`

  const outboxMessage: OutboxMessage = {
    eventId: randomUUID(),
    topic,
    payload: JSON.stringify(event),
    status: OutboxStatus.PENDING,
    createdAt: clock.now(),
    attempts: 0
  }

  outbox.save(outboxMessage)

  try {
    await mqtt.publish(topic, outboxMessage.payload, { qos: 1 })
    logger.info('published', { event })
  } catch (err) {
    logger.error('failed to publish', { err, event })
  }
}, config.intervalMs)

const heartbeatInterval = setInterval(() => {
  logger.info('simulator heartbeat')
  const heartbeatTopic = `${config.mqtt.heartbeatTopic}/${config.telemetry.machineId}`
  mqtt.publish(
    heartbeatTopic,
    JSON.stringify({ timestamp: clock.now().toISOString() }),
    { qos: 0 }
  )
}, config.heartbeatIntervalMs)

async function shutdown(signal: string) {
  logger.info('simulator shutting down', { signal })
  clearInterval(telemetryInterval)
  clearInterval(heartbeatInterval)
  await mqtt.close()
  db.close()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
