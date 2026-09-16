export type IncomingMessage = {
  id: string
  topic: string
  payload: Buffer
  receivedAt: Date
}
