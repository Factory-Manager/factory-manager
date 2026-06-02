import { MachineConfig } from "../../src/domain/machine/machine-config"
import { Range } from "../../src/domain/shared/value-objects/range/range"

import { Temperature } from "../../src/domain/machine/value-objects/temperature"
import { PowerConsumption } from "../../src/domain/machine/value-objects/power-consuption"
import { Emission } from "../../src/domain/machine/value-objects/emission"
import { Vibration } from "../../src/domain/machine/value-objects/vibration"
import { Pressure } from "../../src/domain/machine/value-objects/pressure"

import { MACHINE_LIMITS } from "../constants/machine-limits"

export function fakeConfig(overrides?: any): MachineConfig {
  return new MachineConfig(
    new Range(
      new Temperature(
        overrides?.temperature?.min ??
          MACHINE_LIMITS.TEMPERATURE.MIN
      ),
      new Temperature(
        overrides?.temperature?.max ??
          MACHINE_LIMITS.TEMPERATURE.MAX
      )
    ),

    new Range(
      new PowerConsumption(
        overrides?.powerConsumption?.min ??
          MACHINE_LIMITS.POWER_CONSUMPTION.MIN
      ),
      new PowerConsumption(
        overrides?.powerConsumption?.max ??
          MACHINE_LIMITS.POWER_CONSUMPTION.MAX
      )
    ),

    new Range(
      new Emission(
        overrides?.emissions?.min ??
          MACHINE_LIMITS.EMISSION.MIN
      ),
      new Emission(
        overrides?.emissions?.max ??
          MACHINE_LIMITS.EMISSION.MAX
      )
    ),

    new Range(
      new Vibration(
        overrides?.vibration?.min ??
          MACHINE_LIMITS.VIBRATION.MIN
      ),
      new Vibration(
        overrides?.vibration?.max ??
          MACHINE_LIMITS.VIBRATION.MAX
      )
    ),

    new Range(
      new Pressure(
        overrides?.pressure?.min ??
          MACHINE_LIMITS.PRESSURE.MIN
      ),
      new Pressure(
        overrides?.pressure?.max ??
          MACHINE_LIMITS.PRESSURE.MAX
      )
    )
  )
}