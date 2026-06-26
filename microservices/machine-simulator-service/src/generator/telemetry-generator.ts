import type { TelemetryConfig } from '../config/env'
import { SystemClock } from '../infrastructure/time/system-clock'
import { TelemetryEvent } from '../types/telemetry-event'
import { random } from '../utils/random'

export function generateTelemetry(
  config: TelemetryConfig,
  clock: SystemClock
): TelemetryEvent {
  return {
    machineId: config.machineId,
    occurredAt: clock.now().toISOString(),
    operatingTemperature: random(
      config.operatingTemperature.min,
      config.operatingTemperature.max
    ),
    vibration: random(config.vibration.min, config.vibration.max),
    powerConsumption: random(
      config.powerConsumption.min,
      config.powerConsumption.max
    ),
    emissions: random(config.emissions.min, config.emissions.max),
    pressure: random(config.pressure.min, config.pressure.max)
  }
}
