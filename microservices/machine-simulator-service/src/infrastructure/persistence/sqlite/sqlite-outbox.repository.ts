import { Database } from 'better-sqlite3'
import { OutboxRepository } from '../../../messaging/outbox/outbox.repository'
import { OutboxMessage } from '../../../messaging/outbox/outbox-message'

export class SqliteOutboxRepository implements OutboxRepository {
  constructor(private readonly db: Database) {}

  save(message: OutboxMessage): void {
    const query = `
            INSERT INTO machine_simulator_outbox (
                event_id, 
                topic, 
                payload, 
                status,
                created_at, 
                attempts
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `
    const params = [
      message.eventId,
      message.topic,
      message.payload,
      message.status.toString(),
      message.createdAt.toISOString(),
      message.attempts
    ]
    this.db.prepare(query).run(params)
  }

  updateStatus(eventId: string, status: string, attempts: number): void {
    const query = `
            UPDATE machine_simulator_outbox
            SET status = ?, attempts = ?
            WHERE event_id = ?
        `
    const params = [status, attempts, eventId]
    this.db.prepare(query).run(params)
  }
}
