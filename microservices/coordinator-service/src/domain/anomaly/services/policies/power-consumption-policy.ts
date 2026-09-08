import { randomUUID } from 'crypto'
import { TelemetryEvent } from '@/application/telemetry/dto/telemetry-event'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { Anomaly } from '@/domain/anomaly/anomaly'
import { AnomalyEventId } from '@/domain/anomaly/value-objects/anomaly-event-id'
import { SensorType } from '@/domain/anomaly/value-objects/sensor-type'
import { AnomalyPolicy } from './anomaly-policy'
import { PowerConsumption } from '@/domain/machine/value-objects/power-consumption'

export class PowerConsumptionPolicy implements AnomalyPolicy {
  evaluate(event: TelemetryEvent, config: MachineConfig): Anomaly[] {
    const anomalies: Anomaly[] = []
    if (
      !config.powerConsumption.contains(
        new PowerConsumption(event.powerConsumption)
      )
    ) {
      anomalies.push(
        new Anomaly(
          new AnomalyEventId(randomUUID()),
          new MachineId(event.machineId),
          SensorType.POWER_CONSUMPTION,
          event.powerConsumption,
          event.occurredAt,
          event.processedAt
        )
      )
    }
    return anomalies
  }
}
