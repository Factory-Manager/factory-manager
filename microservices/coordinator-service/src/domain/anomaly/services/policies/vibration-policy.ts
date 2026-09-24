import { randomUUID } from 'crypto'
import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { AnomalyEventId } from '@/domain/anomaly/value-objects/anomaly-event-id'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { AnomalyPolicy } from './anomaly-policy'
import { Vibration } from '@/domain/machine/value-objects/vibration'

export class VibrationPolicy implements AnomalyPolicy {
  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[] {
    const anomalies: Anomaly[] = []
    if (!config.vibration.contains(new Vibration(event.vibration))) {
      anomalies.push(
        new Anomaly(
          new AnomalyEventId(randomUUID()),
          new MachineId(event.machineId),
          SensorType.VIBRATION,
          event.vibration,
          event.occurredAt,
          event.processedAt
        )
      )
    }
    return anomalies
  }
}
