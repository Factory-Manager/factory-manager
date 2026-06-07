import { randomUUID } from 'crypto'
import { TelemetryEvent } from '../../../../application/telemetry/dto/telemetry-event'
import { MachineConfig } from '../../../machine/machine-config'
import { MachineId } from '../../../machine/value-objects/machine-id'
import { Anomaly } from '../../anomaly'
import { AnomalyEventId } from '../../value-objects/anomaly-event-id'
import { SensorType } from '../../value-objects/sensor-type'
import { AnomalyPolicy } from './anomaly-policy'
import { Temperature } from '../../../machine/value-objects/temperature'

export class TemperaturePolicy implements AnomalyPolicy {
  evaluate(
    event: TelemetryEvent,
    config: MachineConfig,
    processedAt: Date
  ): Anomaly[] {
    const anomalies: Anomaly[] = []
    if (
      !config.temperature.contains(new Temperature(event.operatingTemperature))
    ) {
      anomalies.push(
        new Anomaly(
          new AnomalyEventId(randomUUID()),
          new MachineId(event.machineId),
          SensorType.TEMPERATURE,
          event.operatingTemperature,
          processedAt
        )
      )
    }
    return anomalies
  }
}
