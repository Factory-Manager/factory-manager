import { MessageProcessor } from '../messaging/message-processor'
import { Logger } from '../ports/logger'
import { InboxRepository } from '../ports/inbox.repository'
import { InboxStatus } from '@/infrastructure/persistence/sqlite/models/inbox-message'
import { Clock } from '../ports/clock'

export class InboxWorker {
  constructor(
    private readonly processors: MessageProcessor[],
    private readonly inboxRepository: InboxRepository,
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  async run(): Promise<void> {
    this.logger.info('Inbox worker started')

    const messages = this.inboxRepository.findPending()

    for (const msg of messages) {
      const processor = this.processors.find((h) => h.canHandle(msg.topic))

      if (!processor) {
        this.inboxRepository.updateStatus(
          msg.eventId,
          InboxStatus.UNSUPPORTED,
          msg.attempts,
          this.clock.now()
        )

        this.logger.warn('No processor found for message', { msg })
        continue
      }

      try {
        await processor.process(msg)

        this.inboxRepository.updateStatus(
          msg.eventId,
          InboxStatus.PROCESSED,
          msg.attempts + 1,
          this.clock.now()
        )

        this.logger.info('Message processed successfully', { msg })
      } catch (err) {
        this.inboxRepository.updateStatus(
          msg.eventId,
          InboxStatus.PENDING,
          msg.attempts + 1,
          this.clock.now()
        )

        this.logger.error('Message processing failed', { err, msg })
      }
    }
  }
}
