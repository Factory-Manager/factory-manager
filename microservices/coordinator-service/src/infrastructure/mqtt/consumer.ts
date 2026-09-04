import { createMqttClient } from './client'
import { Logger } from '@/application/ports/logger'

export function createMqttConsumer(url: string, logger: Logger) {
  const base = createMqttClient(url, logger)

  return {
    subscribe(topic: string, options?: { qos: 0 | 1 | 2 }) {
      base.client.subscribe(topic, options, (err) => {
        if (err) {
          logger.error('subscribe failed', { topic, err })
          return
        }
        logger.info('subscribed', { topic })
      })
    },

    onMessage(handler: (topic: string, message: Buffer) => void) {
      base.client.on('message', handler)
    },

    close: base.close
  }
}
