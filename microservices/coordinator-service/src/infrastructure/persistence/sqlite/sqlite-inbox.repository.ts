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

  findPending(): InboxMessage[] {
    const query = `
      SELECT 
        event_id,
        topic,
        payload,
        status,
        received_at,
        processed_at
      FROM coordinator_inbox
      WHERE status = 'PENDING'
      ORDER BY received_at ASC
    `
    const rows = this.db.prepare(query).all() as InboxMessage[]

    return rows.map((row) => ({
      eventId: row.eventId,
      topic: row.topic,
      payload: row.payload,
      status: row.status as InboxMessage['status'],
      receivedAt: new Date(row.receivedAt),
      processedAt: row.processedAt ? new Date(row.processedAt) : null
    }))
  }
}
