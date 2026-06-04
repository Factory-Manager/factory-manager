export class AnomalyEventIdInvalidError extends Error {
  constructor() {
    super('AnomalyEventId cannot be empty')
    this.name = 'AnomalyEventIdInvalidError'
  }
}
