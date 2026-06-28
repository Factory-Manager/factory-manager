import mqtt from 'mqtt'
import { Logger } from '@/application/ports/logger'

export function createMqttClient(url: string, logger: Logger) {
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
    client,
    close: () =>
      new Promise<void>((resolve) => client.end(false, {}, () => resolve()))
  }
}
