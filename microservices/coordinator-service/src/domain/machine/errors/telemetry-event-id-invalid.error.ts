export class TelemetryEventIdInvalidError extends Error {
  constructor() {
    super('TelemetryEventId cannot be empty')
    this.name = 'TelemetryEventIdInvalidError'
  }
}
