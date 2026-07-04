import { InboxMessage } from '../../infrastructure/persistence/sqlite/models/inbox-message'

export interface InboxRepository {
  save(message: InboxMessage): void
}
