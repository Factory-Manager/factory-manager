import { MachineConfig } from '@/domain/machine/machine-config'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { AnomalyEventId } from '@/domain/anomaly/value-objects/anomaly-event-id'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { AnomalyPolicy } from './anomaly-policy'
import { TelemetryEvent } from '@/domain/machine/telemetry'
import { IdGenerator } from '@/domain/ports/id-generator'

export class EmissionPolicy implements AnomalyPolicy {
  constructor(private readonly generator: IdGenerator) {}

  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[] {
    const anomalies: Anomaly[] = []
    if (!config.emissions.contains(event.emissions)) {
      anomalies.push(
        new Anomaly(
          new AnomalyEventId(this.generator.generateId()),
          event.id,
          SensorType.EMISSIONS,
          event.emissions.value,
          event.occurredAt,
          event.processedAt
        )
      )
    }
    return anomalies
  }
}
