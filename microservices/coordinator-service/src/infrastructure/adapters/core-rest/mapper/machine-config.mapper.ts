import { MachineConfig } from '@/domain'
import { Range } from '@/domain/shared/value-objects/range/range'

import { MachineDto } from '../dto/machine.dto'
import { Temperature } from '@/domain/machine/value-objects/temperature'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { Pressure } from '@/domain/machine/value-objects/pressure'
import { Vibration } from '@/domain/machine/value-objects/vibration'
import { Emission } from '@/domain/machine/value-objects/emission'
import { PowerConsumption } from '@/domain/machine/value-objects/power-consumption'

export function toMachineConfig(dto: MachineDto): MachineConfig {
  return new MachineConfig(
    new MachineId(dto.id),

    new Range(
      new Temperature(dto.specifications.operatingTemperature.normalRange.min),
      new Temperature(dto.specifications.operatingTemperature.normalRange.max)
    ),

    new Range(
      new PowerConsumption(dto.specifications.powerConsumption.normalRange.min),
      new PowerConsumption(dto.specifications.powerConsumption.normalRange.max)
    ),

    new Range(
      new Emission(dto.specifications.emissions.normalRange.min),
      new Emission(dto.specifications.emissions.normalRange.max)
    ),

    new Range(
      new Vibration(dto.specifications.vibration.normalRange.min),
      new Vibration(dto.specifications.vibration.normalRange.max)
    ),

    new Range(
      new Pressure(dto.specifications.pressure.normalRange.min),
      new Pressure(dto.specifications.pressure.normalRange.max)
    )
  )
}
