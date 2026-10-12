export enum InboxStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  UNSUPPORTED = 'UNSUPPORTED'
}

export type InboxMessage = {
  eventId: string
  topic: string
  payload: string
  status: InboxStatus
  attempts: number
  receivedAt: Date
  processedAt: Date | null
}
