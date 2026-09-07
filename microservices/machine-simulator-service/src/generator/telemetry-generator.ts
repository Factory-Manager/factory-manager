import type { TelemetryConfig } from '../config/env'
import { SystemClock } from '../infrastructure/time/system-clock'
import type { TelemetryEvent } from '../types/telemetry-event'
import { random, randomOutsideRange } from '../utils/random'

let sequenceNumber: number = 0

export function generateTelemetry(
  config: TelemetryConfig,
  clock: SystemClock
): TelemetryEvent {
  sequenceNumber++

  return {
    machineId: config.machineId,
    sequenceNumber,
    occurredAt: clock.now().toISOString(),
    operatingTemperature: config.anomalies.includes('temperature')
      ? randomOutsideRange(
          config.operatingTemperature.min,
          config.operatingTemperature.max
        )
      : random(
          config.operatingTemperature.min,
          config.operatingTemperature.max
        ),

    vibration: config.anomalies.includes('vibration')
      ? randomOutsideRange(config.vibration.min, config.vibration.max)
      : random(config.vibration.min, config.vibration.max),

    powerConsumption: config.anomalies.includes('powerConsumption')
      ? randomOutsideRange(
          config.powerConsumption.min,
          config.powerConsumption.max
        )
      : random(config.powerConsumption.min, config.powerConsumption.max),

    emissions: config.anomalies.includes('emissions')
      ? randomOutsideRange(config.emissions.min, config.emissions.max)
      : random(config.emissions.min, config.emissions.max),

    pressure: config.anomalies.includes('pressure')
      ? randomOutsideRange(config.pressure.min, config.pressure.max)
      : random(config.pressure.min, config.pressure.max)
  }
}
