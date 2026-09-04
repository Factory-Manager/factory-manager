import { Logger } from '../ports/logger'
import { InboxRepository } from '../ports/inbox.repository'
import {
  InboxMessage,
  InboxStatus
} from '@/infrastructure/persistence/sqlite/models/inbox-message'
import { IncomingMessage } from './incoming-message'

export class InboxReceiver {
  constructor(
    private readonly inboxRepository: InboxRepository,
    private readonly logger: Logger
  ) {}

  receive(incomingMessage: IncomingMessage): void {
    const inboxMessage: InboxMessage = {
      eventId: incomingMessage.id,
      topic: incomingMessage.topic,
      payload: incomingMessage.payload.toString(),
      status: InboxStatus.PENDING,
      attempts: 0,
      receivedAt: incomingMessage.receivedAt,
      processedAt: null
    }
    this.inboxRepository.save(inboxMessage)
    this.logger.info('message saved to inbox', { inboxMessage })
  }
}
