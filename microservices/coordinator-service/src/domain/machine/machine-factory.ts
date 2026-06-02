import { Emission } from '../value-objects/emission'
import { Machine } from './machine'
import { PowerConsumption } from '../value-objects/power-consuption'
import { Pressure } from '../value-objects/pressure'
import { Temperature } from '../value-objects/temperature'
import { Vibration } from '../value-objects/vibration'
import { MachineId } from '../value-objects/machine-id'

export class MachineFactory {
  static createFromSensors(
    id: string,
    sensors: {
      temperature: number
      power: number
      emission: number
      vibration: number
      pressure: number
    }
  ): Machine {
    return new Machine(
      new MachineId(id),
      new Temperature(sensors.temperature),
      new PowerConsumption(sensors.power),
      new Emission(sensors.emission),
      new Vibration(sensors.vibration),
      new Pressure(sensors.pressure)
    )
  }
}
