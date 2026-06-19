import { createAreaService } from '#src/application/areas/area.service.js'
import { createAreaRepository } from '#src/persistence/mongoose/repositories/area.repository.js'
import { createMachineRepository } from '#src/persistence/mongoose/repositories/machine.repository.js'

export function createAreasBootstrap() {
  const areaRepository = createAreaRepository()
  const machineRepository = createMachineRepository()
  const areaService = createAreaService({ areaRepository, machineRepository })

  return { areaService }
}
