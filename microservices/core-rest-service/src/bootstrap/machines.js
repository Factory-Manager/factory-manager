import { createMachineService } from '#src/application/machines/machine.service.js'
import { env } from '#src/config/env.js'
import { createAuthenticateServiceToken } from '#src/middlewares/authenticate-service-token.js'
import { createAreaRepository } from '#src/persistence/mongoose/repositories/area.repository.js'
import { createMachineRepository } from '#src/persistence/mongoose/repositories/machine.repository.js'
import { logger } from './logger.js'

export function createMachinesBootstrap() {
  const machineRepository = createMachineRepository()
  const areaRepository = createAreaRepository()

  const machineService = createMachineService({
    machineRepository,
    areaRepository,
    logger
  })

  const authenticateServiceToken = createAuthenticateServiceToken({
    serviceToken: env.serviceToken
  })

  return { machineService, authenticateServiceToken }
}
