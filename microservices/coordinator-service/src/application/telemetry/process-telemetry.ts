import { TelemetryEvent } from './dto/telemetry-event'
import { TelemetryInput } from './dto/telemetry-input'

export class ProcessTelemetry {
  execute(input: TelemetryInput): TelemetryEvent {
    if (!input.machineId) throw new Error('Invalid input')

    return {
      machineId: input.machineId,
      occurredAt: new Date(input.occurredAt),
      operatingTemperature: Number(input.operatingTemperature),
      powerConsumption: Number(input.powerConsumption),
      emissions: Number(input.emissions),
      vibration: Number(input.vibration),
      pressure: Number(input.pressure)
    }
  }
}
