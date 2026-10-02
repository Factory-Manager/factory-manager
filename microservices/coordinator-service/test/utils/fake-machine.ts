import { MachineFactory } from '@/domain/machine/machine-factory'
import { MACHINE_VALUES } from '@test/constants/machine-values'

export function fakeMachine(overrides?: {
  id?: string
  temperature?: number
  powerConsumption?: number
  emissions?: number
  vibration?: number
  pressure?: number
  occurredAt?: Date
  processedAt?: Date
  sequenceNumber?: number
}) {
  return MachineFactory.create(
    overrides?.id ?? MACHINE_VALUES.ID,
    overrides?.temperature ?? MACHINE_VALUES.TEMPERATURE.SAFE,
    overrides?.powerConsumption ?? MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
    overrides?.emissions ?? MACHINE_VALUES.EMISSION.SAFE,
    overrides?.vibration ?? MACHINE_VALUES.VIBRATION.SAFE,
    overrides?.pressure ?? MACHINE_VALUES.PRESSURE.SAFE,
    overrides?.occurredAt ?? MACHINE_VALUES.OCCURRED_AT,
    overrides?.processedAt ?? MACHINE_VALUES.PROCESSED_AT,
    overrides?.sequenceNumber ?? MACHINE_VALUES.SEQUENCE_NUMBER
  )
}
