import { MachineFactory } from '../../domain'
import { TelemetryInput } from './dto/telemetry-input'

export class ProcessTelemetry {
  execute(input: TelemetryInput) {
    return MachineFactory.createFromSensors(
      input.id,
      input.temperature,
      input.powerConsumption,
      input.emissions,
      input.vibration,
      input.pressure
    )
  }
}
