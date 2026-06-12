import { createAreaService } from '../application/areas/area.service.js'
import { createAreaRepository } from '../persistence/mongoose/repositories/area.repository.js'

export function createAreasBootstrap() {
  const areaRepository = createAreaRepository()
  const areaService = createAreaService({ areaRepository })

  return { areaService }
}
