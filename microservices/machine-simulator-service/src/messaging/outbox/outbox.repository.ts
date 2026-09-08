import { OutboxMessage } from './outbox-message'

export interface OutboxRepository {
  save(message: OutboxMessage): void
  updateStatus(eventId: string, status: string, attempts: number): void
}
