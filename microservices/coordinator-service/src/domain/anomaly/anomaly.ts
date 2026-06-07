import { MachineId } from '../machine/value-objects/machine-id'
import { AnomalyEventId } from './value-objects/anomaly-event-id'
import { SensorType } from './value-objects/sensor-type'

export class Anomaly {
  constructor(
    public readonly id: AnomalyEventId,
    public readonly machineId: MachineId,
    public readonly sensorType: SensorType,
    public readonly value: number,
    public readonly occurredAt: Date
  ) {}
}
