import { MessageProcessor } from './message-processor'
import { Logger } from '../ports/logger'
import { InboxRepository } from '../ports/inbox.repository'
import { Clock } from '../ports/clock'
import { randomUUID } from 'crypto'
import { InboxStatus } from '@/infrastructure/persistence/sqlite/models/inbox-message'

export class MqttMessageDispatcher {
  constructor(
    private readonly processors: MessageProcessor[],
    private readonly inboxRepository: InboxRepository,
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  handle(topic: string, message: Buffer): void {
    this.inboxRepository.save({
      eventId: randomUUID(),
      topic,
      payload: message.toString(),
      status: InboxStatus.PENDING,
      receivedAt: this.clock.now(),
      processedAt: null
    })

    try {
      const processor = this.processors.find((p) => p.canHandle(topic))
      if (!processor) {
        return
      }
      processor.process(topic, message)
    } catch (err) {
      this.logger.error('message processing failed', { err, topic })
    }
  }
}
