import { AnomalyEventIdInvalidError } from '../errors/anomaly-event-id-invalid.error'

export class AnomalyEventId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new AnomalyEventIdInvalidError()
    }
  }

  equals(other: AnomalyEventId): boolean {
    return this.value === other.value
  }
}
