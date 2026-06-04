import { MachineId } from '../machine/value-objects/machine-id'
import { AnomalyEventId } from './value-objects/anomaly-event-id'
import { AnomalyType } from './value-objects/anomaly-type'
import { SensorType } from './value-objects/sensor-type'

export class Anomaly {
  constructor(
    public readonly id: AnomalyEventId,
    public readonly machineId: MachineId,
    public readonly anomalyType: AnomalyType,
    public readonly sensorType: SensorType,
    public readonly value: number,
    public readonly threshold: number,
    public readonly occurredAt: Date
  ) {}
}
