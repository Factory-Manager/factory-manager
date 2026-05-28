import { MachineConfig } from './machine-config'
import { Temperature } from './temperature'

export class Machine {
  constructor(
    public readonly id: string,
    public temperature: Temperature
  ) {}

  isOverheating(config: MachineConfig): boolean {
    return this.temperature.value > config.temperature.max
  }
}
