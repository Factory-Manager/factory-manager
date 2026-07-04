export enum InboxStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED'
}

export type InboxMessage = {
  eventId: string
  topic: string
  payload: string
  status: InboxStatus
  receivedAt: Date
  processedAt: Date | null
}
