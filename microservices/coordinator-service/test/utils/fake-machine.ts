import { MachineFactory } from "../../src/domain/machine/machine-factory"
import { MACHINE_VALUES } from "../constants/machine-values"

export function fakeMachine(overrides?: {
    id?: string
    temperature?: number
    power?: number
    emission?: number
    vibration?: number
    pressure?: number
}) {
  return MachineFactory.createFromSensors(overrides?.id ?? MACHINE_VALUES.ID, {
    temperature: overrides?.temperature ?? MACHINE_VALUES.TEMPERATURE.SAFE,
    power: overrides?.power ?? MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
    emission: overrides?.emission ?? MACHINE_VALUES.EMISSION.SAFE,
    vibration: overrides?.vibration ?? MACHINE_VALUES.VIBRATION.SAFE,
    pressure: overrides?.pressure ?? MACHINE_VALUES.PRESSURE.SAFE,
  })
}