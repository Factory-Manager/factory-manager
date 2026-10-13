import { TelemetryEventIdInvalidError } from '../errors/telemetry-event-id-invalid.error'

export class TelemetryEventId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new TelemetryEventIdInvalidError()
    }
  }

  equals(other: TelemetryEventId): boolean {
    return this.value === other.value
  }
}
