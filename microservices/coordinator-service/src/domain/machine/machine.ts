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
    return config.temperature.isAboveOrEqualMax(this.temperature)
  }

  isUnderheating(config: MachineConfig): boolean {
    return config.temperature.isBelowOrEqualMin(this.temperature)
  }

  isOverconsuming(config: MachineConfig): boolean {
    return config.powerConsumption.isAboveOrEqualMax(this.powerConsumption)
  }

  isOveremitting(config: MachineConfig): boolean {
    return config.emissions.isAboveOrEqualMax(this.emissions)
  }

  isOvervibrating(config: MachineConfig): boolean {
    return config.vibration.isAboveOrEqualMax(this.vibration)
  }

  isOverpressurized(config: MachineConfig): boolean {
    return config.pressure.isAboveOrEqualMax(this.pressure)
  }
}
