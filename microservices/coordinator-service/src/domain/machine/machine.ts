import { Emission } from '../value-objects/emission'
import { MachineConfig } from './machine-config'
import { PowerConsumption } from '../value-objects/power-consuption'
import { Pressure } from '../value-objects/pressure'
import { Temperature } from '../value-objects/temperature'
import { Vibration } from '../value-objects/vibration'
import { MachineId } from '../value-objects/machine-id'

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
    return this.temperature.value >= config.temperature.max
  }

  isUnderheating(config: MachineConfig): boolean {
    return this.temperature.value <= config.temperature.min
  }

  isOverconsuming(config: MachineConfig): boolean {
    return this.powerConsumption.value >= config.powerConsumption.max
  }

  isOveremitting(config: MachineConfig): boolean {
    return this.emissions.value >= config.emissions.max
  }

  isOvervibrating(config: MachineConfig): boolean {
    return this.vibration.value >= config.vibration.max
  }

  isOverpressurized(config: MachineConfig): boolean {
    return this.pressure.value >= config.pressure.max
  }
}
