import { MachineFactory } from "../../src/domain/machine/machine-factory"
import { MACHINE_VALUES } from "../constants/machine-values"

export function fakeMachine(overrides?: {
  id?: string
  temperature?: number
  powerConsumption?: number
  emissions?: number
  vibration?: number
  pressure?: number
}) {
  return MachineFactory.createFromSensors(
    overrides?.id ?? MACHINE_VALUES.ID,
    overrides?.temperature ?? MACHINE_VALUES.TEMPERATURE.SAFE,
    overrides?.powerConsumption ?? MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
    overrides?.emissions ?? MACHINE_VALUES.EMISSION.SAFE,
    overrides?.vibration ?? MACHINE_VALUES.VIBRATION.SAFE,
    overrides?.pressure ?? MACHINE_VALUES.PRESSURE.SAFE
  )
}