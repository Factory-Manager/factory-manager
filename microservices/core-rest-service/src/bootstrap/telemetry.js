import { createTelemetryService } from '#src/application/telemetry/telemetry.service.js'
import { createMachineRepository } from '#src/persistence/mongoose/repositories/machine.repository.js'
import { createTelemetryRepository } from '#src/persistence/mongoose/repositories/telemetry.repository.js'

export function createTelemetryBootstrap() {
  const telemetryRepository = createTelemetryRepository()
  const machineRepository = createMachineRepository()

  const telemetryService = createTelemetryService({
    telemetryRepository,
    machineRepository
  })

  return { telemetryService }
}
