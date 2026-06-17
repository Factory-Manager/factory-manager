import {
  MACHINE_STATES,
  isValidStateTransition
} from '#src/domain/machines/machine.states.js'
import { AppError } from '#src/errors/app-error.js'
import { normalizeMachinePagination } from './machine.pagination.js'
import { toMachineOutput, toMachineOutputList } from './machine.serializer.js'

/**
 * Creates the machine application service.
 *
 * @param {Object} deps
 * @param {Object} deps.machineRepository
 * @param {Object} deps.areaRepository
 * @param {Object} [deps.logger] Optional pino logger for high-value state events.
 * @returns {Readonly<Object>}
 */
export function createMachineService({
  machineRepository,
  areaRepository,
  logger
} = {}) {
  if (!machineRepository) {
    throw new TypeError('machineRepository is required')
  }

  if (!areaRepository) {
    throw new TypeError('areaRepository is required')
  }

  async function validateAreaExists(areaId) {
    const area = await areaRepository.findAreaById(areaId)

    if (!area) {
      throw AppError.notFound('Area not found')
    }
  }

  async function createMachine(input) {
    await validateAreaExists(input.location.areaId)

    const machine = await machineRepository.createMachine({
      serial: input.serial,
      name: input.name,
      location: { areaId: input.location.areaId },
      machineState: {
        currentState: MACHINE_STATES.OFF,
        anomalyDetails: []
      },
      specifications: input.specifications
    })

    return toMachineOutput(machine)
  }

  async function getMachineById(id) {
    const machine = await machineRepository.findMachineById(id)
    return toMachineOutput(machine)
  }

  async function updateMachineById(id, input) {
    if (input.location?.areaId) {
      await validateAreaExists(input.location.areaId)
    }

    const updateData = {}

    if (input.serial !== undefined) updateData.serial = input.serial
    if (input.name !== undefined) updateData.name = input.name
    if (input.location?.areaId !== undefined) {
      updateData['location.areaId'] = input.location.areaId
    }
    if (input.specifications !== undefined) {
      updateData.specifications = input.specifications
    }

    const machine = await machineRepository.updateMachineById(id, updateData)
    return toMachineOutput(machine)
  }

  async function deleteMachineById(id) {
    const machine = await machineRepository.deleteMachineById(id)
    return toMachineOutput(machine)
  }

  async function listMachines(query) {
    const { limit, offset } = normalizeMachinePagination(query)
    const machines = await machineRepository.findMachines({
      limit,
      offset,
      areaId: query?.areaId
    })
    return toMachineOutputList(machines)
  }

  async function updateMachineState(id, input) {
    const machine = await machineRepository.findMachineById(id)

    if (!machine) {
      return null
    }

    const currentState = machine.machineState.currentState
    const newState = input.currentState

    if (
      currentState !== newState &&
      !isValidStateTransition(currentState, newState)
    ) {
      throw AppError.unprocessableEntity(
        `Transition from '${currentState}' to '${newState}' is not allowed`
      )
    }

    if (newState === MACHINE_STATES.ANOMALY) {
      if (!input.anomalyDetails || input.anomalyDetails.length === 0) {
        throw AppError.validationError(
          'anomalyDetails is required and must not be empty when state is anomaly'
        )
      }
    }

    const anomalyDetails =
      newState === MACHINE_STATES.ANOMALY ? input.anomalyDetails : []

    const updated = await machineRepository.updateMachineById(id, {
      'machineState.currentState': newState,
      'machineState.anomalyDetails': anomalyDetails
    })

    if (logger) {
      if (newState === MACHINE_STATES.ANOMALY) {
        logger.warn(
          { machineId: id, anomalyDetails },
          'Machine entered anomaly state'
        )
      } else if (newState === MACHINE_STATES.OFF) {
        logger.warn({ machineId: id }, 'Machine powered off')
      }
    }

    return toMachineOutput(updated)
  }

  return Object.freeze({
    createMachine,
    getMachineById,
    updateMachineById,
    deleteMachineById,
    listMachines,
    updateMachineState
  })
}
