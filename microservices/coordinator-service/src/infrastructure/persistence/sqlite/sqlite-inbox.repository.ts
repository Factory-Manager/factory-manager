import { InboxMessage } from '@/infrastructure/persistence/sqlite/models/inbox-message'
import { InboxRepository } from '@/application/ports/inbox.repository'
import { Database } from 'better-sqlite3'

export class SqliteInboxRepository implements InboxRepository {
  constructor(private readonly db: Database) {}
  save(message: InboxMessage): void {
    const query = `
      INSERT OR IGNORE INTO coordinator_inbox (
        event_id, 
        topic, 
        payload,
        status,
        received_at,
        processed_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [
      message.eventId,
      message.topic,
      message.payload,
      message.status,
      message.receivedAt.toISOString(),
      message.processedAt ? message.processedAt.toISOString() : null
    ]
    this.db.prepare(query).run(params)
  }
}
