import { Emission } from './emission'
import { MachineConfig } from './machine-config'
import { PowerConsumption } from './power-consuption'
import { Temperature } from './temperature'

export class Machine {
  constructor(
    public readonly id: string,
    public temperature: Temperature,
    public powerConsumption: PowerConsumption,
    public emissions: Emission
  ) {}

  isOverheating(config: MachineConfig): boolean {
    return this.temperature.value > config.temperature.max
  }

  isOverconsuming(config: MachineConfig): boolean {
    return this.powerConsumption.value > config.powerConsumption.max
  }

  isOveremitting(config: MachineConfig): boolean {
    return this.emissions.value > config.emissions.max
  }
}
