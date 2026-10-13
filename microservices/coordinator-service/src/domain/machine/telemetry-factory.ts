import { Emission } from './value-objects/emission'
import { TelemetryEvent } from './telemetry'
import { PowerConsumption } from './value-objects/power-consumption'
import { Pressure } from './value-objects/pressure'
import { Temperature } from './value-objects/temperature'
import { Vibration } from './value-objects/vibration'
import { MachineId } from './value-objects/machine-id'
import { TelemetryEventId } from './value-objects/telemetry-event-id'

export class TelemetryFactory {
  static create(
    id: string,
    eventId: string,
    temperature: number,
    powerConsumption: number,
    emissions: number,
    vibration: number,
    pressure: number,
    occurredAt: Date,
    processedAt: Date,
    sequenceNumber: number
  ): TelemetryEvent {
    return new TelemetryEvent(
      new MachineId(id),
      new TelemetryEventId(eventId),
      new Temperature(temperature),
      new PowerConsumption(powerConsumption),
      new Emission(emissions),
      new Vibration(vibration),
      new Pressure(pressure),
      new Date(occurredAt),
      new Date(processedAt),
      sequenceNumber
    )
  }
}
