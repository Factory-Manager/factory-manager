import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { AnomalyEventId } from '@/domain/anomaly/value-objects/anomaly-event-id'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { AnomalyPolicy } from './anomaly-policy'
import { Machine } from '@/domain/machine/machine'
import { IdGenerator } from '@/domain/ports/id-generator'

export class VibrationPolicy implements AnomalyPolicy {
  constructor(private readonly generator: IdGenerator) {}

  evaluate(event: Machine, config: MachineConfig): Anomaly[] {
    const anomalies: Anomaly[] = []
    if (!config.vibration.contains(event.vibration)) {
      anomalies.push(
        new Anomaly(
          new AnomalyEventId(this.generator.generateId()),
          event.id,
          SensorType.VIBRATION,
          event.vibration.value,
          event.occurredAt,
          event.processedAt
        )
      )
    }
    return anomalies
  }
}
