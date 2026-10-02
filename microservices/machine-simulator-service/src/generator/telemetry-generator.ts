import type { TelemetryConfig } from '../config/env'
import { SystemClock } from '../infrastructure/time/system-clock'
import { TelemetryRanges } from '../types/telemetry-config'
import type { TelemetryEvent } from '../types/telemetry-event'
import { random, randomOutsideRange } from '../utils/random'

let sequenceNumber: number = 0

function generateValue<T extends keyof TelemetryRanges>(
  config: TelemetryConfig,
  key: T
): number {
  const range = config[key] as { min: number; max: number }

  return config.anomalies.includes(key)
    ? randomOutsideRange(range.min, range.max)
    : random(range.min, range.max)
}

export function generateTelemetry(
  config: TelemetryConfig,
  clock: SystemClock
): TelemetryEvent {
  sequenceNumber++

  return {
    machineId: config.machineId,
    sequenceNumber,
    occurredAt: clock.now().toISOString(),
    operatingTemperature: generateValue(config, 'operatingTemperature'),
    vibration: generateValue(config, 'vibration'),
    powerConsumption: generateValue(config, 'powerConsumption'),
    emissions: generateValue(config, 'emissions'),
    pressure: generateValue(config, 'pressure')
  }
}
