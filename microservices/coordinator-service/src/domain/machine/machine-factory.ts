import { Emission } from './value-objects/emission'
import { Machine } from './machine'
import { PowerConsumption } from './value-objects/power-consuption'
import { Pressure } from './value-objects/pressure'
import { Temperature } from './value-objects/temperature'
import { Vibration } from './value-objects/vibration'
import { MachineId } from './value-objects/machine-id'

export class MachineFactory {
  static createFromSensors(
    id: string,
    temperature: number,
    powerConsumption: number,
    emissions: number,
    vibration: number,
    pressure: number
  ): Machine {
    return new Machine(
      new MachineId(id),
      new Temperature(temperature),
      new PowerConsumption(powerConsumption),
      new Emission(emissions),
      new Vibration(vibration),
      new Pressure(pressure)
    )
  }
}
