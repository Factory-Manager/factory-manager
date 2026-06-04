import { MachineId } from '../machine/value-objects/machine-id'
import { AnomalyEventId } from './value-objetcs/anomaly-event-id'
import { SensorType } from './value-objetcs/sensor-type'
import { AnomalyType } from './value-objetcs/anomaly-type'

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
