import { InboxMessage } from '../messaging/inbox-message'

export interface InboxRepository {
  save(message: InboxMessage): void
  updateStatus(
    eventId: string,
    status: string,
    attempts: number,
    processedAt: Date | null
  ): void
  findPending(): InboxMessage[]
}
