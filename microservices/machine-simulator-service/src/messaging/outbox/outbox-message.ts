export enum OutboxStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

export type OutboxMessage = {
  eventId: string
  topic: string
  payload: string
  status: OutboxStatus
  createdAt: Date
  attempts: number
}
