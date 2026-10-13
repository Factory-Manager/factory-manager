import { Database } from 'better-sqlite3'
import { HeartbeatEvent } from '@/application/heartbeat/dto/heartbeat-event'
import { HeartbeatRepository } from '@/application/ports/heartbeats.repository'

export class SqliteHeartbeatRepository implements HeartbeatRepository {
  constructor(private readonly db: Database) {}
  findLatestForEachMachine(topicPrefix: string): HeartbeatEvent[] {
    const query = `
            SELECT
                event_id,
                topic,
                payload,
                received_at
            FROM (
                SELECT
                event_id,
                topic,
                payload,
                received_at,
                ROW_NUMBER() OVER (
                    PARTITION BY topic
                    ORDER BY received_at DESC
                ) AS row_number
                FROM coordinator_inbox
                WHERE topic LIKE ?
                AND status = 'PROCESSED'
            )
            WHERE row_number = 1
        `

    const rows = this.db.prepare(query).all(`${topicPrefix}/%`) as {
      event_id: string
      topic: string
      payload: string
      received_at: string
    }[]

    return rows.map((row) => {
      const machineId = row.topic.split('/').pop()

      if (!machineId) {
        throw new Error(`Invalid heartbeat topic: ${row.topic}`)
      }

      const payload = JSON.parse(row.payload) as {
        timestamp: string
      }

      const occurredAt = new Date(payload.timestamp)

      if (Number.isNaN(occurredAt.getTime())) {
        throw new Error(`Invalid heartbeat timestamp for event ${row.event_id}`)
      }

      return {
        machineId,
        occurredAt,
        receivedAt: new Date(row.received_at)
      }
    })
  }
}
