import mqtt from 'mqtt'
import { PinoLogger } from '../infrastructure/logger/pino-logger'

export function createMqttClient(url: string, logger: PinoLogger) {
  const client = mqtt.connect(url)

  client.on('connect', () => {
    logger.info('connected')
  })

  client.on('reconnect', () => {
    logger.info(`reconnecting...`)
  })

  client.on('error', (err) => {
    logger.error('mqtt client error', { err })
  })

  return {
    publish(
      topic: string,
      message: string,
      options?: { qos: 0 | 1 | 2 }
    ): Promise<void> {
      logger.info(`publishing message to topic ${topic}`, { message })

      return new Promise((resolve, reject) => {
        client.publish(topic, message, options ?? {}, (err) => {
          if (err) {
            logger.error('publish failed', { err })
            return reject(err)
          }

          logger.info(`published message to topic ${topic}`)
          resolve()
        })
      })
    },

    close(): Promise<void> {
      return new Promise((resolve) => {
        client.end(false, {}, () => resolve())
      })
    }
  }
}
