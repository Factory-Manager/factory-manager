import {
  InboxMessage,
  InboxStatus
} from '@/infrastructure/persistence/sqlite/models/inbox-message'
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
        attempts,
        received_at,
        processed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      message.eventId,
      message.topic,
      message.payload,
      message.status,
      message.attempts,
      message.receivedAt.toISOString(),
      message.processedAt ? message.processedAt.toISOString() : null
    ]
    this.db.prepare(query).run(params)
  }

  updateStatus(
    eventId: string,
    status: string,
    attempts: number,
    processedAt: Date | null
  ): void {
    const query = `
      UPDATE coordinator_inbox
      SET status = ?, attempts = ?, processed_at = ?
      WHERE event_id = ?
    `
    const params = [
      status,
      attempts,
      processedAt ? processedAt.toISOString() : null,
      eventId
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
      attempts,
      received_at,
      processed_at
    FROM coordinator_inbox
    WHERE status = 'PENDING'
    ORDER BY received_at ASC
  `

    const rows = this.db.prepare(query).all() as {
      event_id: string
      topic: string
      payload: string
      status: InboxStatus
      attempts: number
      received_at: string
      processed_at: string | null
    }[]

    return rows.map((row) => ({
      eventId: row.event_id,
      topic: row.topic,
      payload: row.payload,
      status: row.status,
      attempts: row.attempts,
      receivedAt: new Date(row.received_at),
      processedAt: row.processed_at ? new Date(row.processed_at) : null
    }))
  }
}
