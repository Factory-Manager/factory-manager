import mqtt from 'mqtt'
import { PinoLogger } from '../infrastructure/logger/pino-logger'

export function createMqttClient(url: string, logger: PinoLogger) {
  const client = mqtt.connect(url)

  client.on('connect', () => {
    logger.info('connected')
  })

  client.on('reconnect', () => {
    logger.info(`simulator reconnecting...`)
  })

  client.on('error', (err) => {
    logger.error('error', err)
  })

  return {
    publish(topic: string, message: string) {
      logger.info(`published message to topic ${topic}`, { message })
      client.publish(topic, message)
    },

    close() {
      logger.info('closing mqtt client')
      client.end()
    }
  }
}
