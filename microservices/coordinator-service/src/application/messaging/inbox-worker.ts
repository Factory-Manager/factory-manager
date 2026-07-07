import { MessageProcessor } from './message-processor'
import { Logger } from '../ports/logger'
import { InboxRepository } from '../ports/inbox.repository'

export class InboxWorker {
  constructor(
    private readonly processors: MessageProcessor[],
    private readonly inboxRepository: InboxRepository,
    private readonly logger: Logger
  ) {}

  run() {
    this.logger.info('Inbox worker started')
    const messages = this.inboxRepository.findPending()

    for (const msg of messages) {
      try {
        const processor = this.processors.find((h) => h.canHandle(msg.topic))
        if (!processor) continue
        processor.process(msg)
        this.logger.info('message processed successfully', { msg })
      } catch (err) {
        this.logger.error('message processing failed', { err, msg })
      }
    }
  }
}
