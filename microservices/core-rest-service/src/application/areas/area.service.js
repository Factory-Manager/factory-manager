import { AppError } from '#src/errors/app-error.js'
import { normalizeAreaPagination } from './area.pagination.js'
import { toAreaOutput, toAreaOutputList } from './area.serializer.js'

/**
 * Creates the area application service.
 *
 * @param {Object} serviceDependencies
 * @param {Object} serviceDependencies.areaRepository
 * @param {Object} serviceDependencies.machineRepository
 * @returns {Readonly<Object>}
 */
export function createAreaService({ areaRepository, machineRepository } = {}) {
  if (!areaRepository) {
    throw new TypeError('areaRepository is required')
  }

  if (!machineRepository) {
    throw new TypeError('machineRepository is required')
  }

  async function createArea(input) {
    const area = await areaRepository.createArea({
      name: input.name,
      size: input.size
    })

    return toAreaOutput(area)
  }

  async function getAreaById(id) {
    const area = await areaRepository.findAreaById(id)

    return toAreaOutput(area)
  }

  async function updateAreaById(id, input) {
    const updateData = {
      ...(input.name === undefined ? {} : { name: input.name }),
      ...(input.size === undefined ? {} : { size: input.size })
    }

    const area = await areaRepository.updateAreaById(id, updateData)

    return toAreaOutput(area)
  }

  async function deleteAreaById(id) {
    const machines = await machineRepository.findMachines({
      areaId: id,
      limit: 1,
      offset: 0
    })

    if (machines.length > 0) {
      throw AppError.conflict(
        'Area cannot be deleted while machines are assigned to it'
      )
    }

    const area = await areaRepository.deleteAreaById(id)

    return toAreaOutput(area)
  }

  async function listAreas(pagination) {
    const areas = await areaRepository.findAreas(
      normalizeAreaPagination(pagination)
    )

    return toAreaOutputList(areas)
  }

  return Object.freeze({
    createArea,
    getAreaById,
    updateAreaById,
    deleteAreaById,
    listAreas
  })
}
