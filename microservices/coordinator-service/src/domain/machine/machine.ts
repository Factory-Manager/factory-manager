import type { Emission } from './value-objects/emission'
import type { MachineConfig } from './machine-config'
import type { PowerConsumption } from './value-objects/power-consuption'
import type { Pressure } from './value-objects/pressure'
import type { Temperature } from './value-objects/temperature'
import type { Vibration } from './value-objects/vibration'
import type { MachineId } from './value-objects/machine-id'

export class Machine {
  constructor(
    public readonly id: MachineId,
    public temperature: Temperature,
    public powerConsumption: PowerConsumption,
    public emissions: Emission,
    public vibration: Vibration,
    public pressure: Pressure
  ) {}

  isEqual(other: Machine): boolean {
    return this.id.equals(other.id)
  }

  isOverheating(config: MachineConfig): boolean {
    return this.temperature.isGreaterThanOrEqual(config.temperature.max)
  }

  isUnderheating(config: MachineConfig): boolean {
    return this.temperature.isLessThanOrEqual(config.temperature.min)
  }

  isOverconsuming(config: MachineConfig): boolean {
    return this.powerConsumption.isGreaterThanOrEqual(
      config.powerConsumption.max
    )
  }

  isOveremitting(config: MachineConfig): boolean {
    return this.emissions.isGreaterThanOrEqual(config.emissions.max)
  }

  isOvervibrating(config: MachineConfig): boolean {
    return this.vibration.isGreaterThanOrEqual(config.vibration.max)
  }

  isOverpressurized(config: MachineConfig): boolean {
    return this.pressure.isGreaterThanOrEqual(config.pressure.max)
  }
}
