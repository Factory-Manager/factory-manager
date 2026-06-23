import { AppError } from '#src/errors/app-error.js'
import { normalizeTelemetryPagination } from './telemetry.pagination.js'
import {
  toTelemetryOutput,
  toTelemetryOutputList
} from './telemetry.serializer.js'

/**
 * Creates the telemetry application service.
 *
 * @param {Object} deps
 * @param {Object} deps.telemetryRepository
 * @param {Object} deps.machineRepository
 * @returns {Readonly<Object>}
 */
export function createTelemetryService({
  telemetryRepository,
  machineRepository
} = {}) {
  if (!telemetryRepository) {
    throw new TypeError('telemetryRepository is required')
  }

  if (!machineRepository) {
    throw new TypeError('machineRepository is required')
  }

  async function createTelemetry(input) {
    const machine = await machineRepository.findMachineById(input.machineId)

    if (!machine) {
      throw AppError.notFound('Machine not found')
    }

    const record = await telemetryRepository.createTelemetry({
      eventId: input.eventId,
      machineId: input.machineId,
      sequenceNumber: input.sequenceNumber,
      capturedAt: new Date(input.capturedAt),
      readings: input.readings,
      anomaly: {
        isAnomaly: input.anomaly.isAnomaly,
        details: input.anomaly.isAnomaly ? input.anomaly.details : []
      }
    })

    return toTelemetryOutput(record)
  }

  async function listTelemetry({
    machineId,
    from,
    to,
    limit,
    offset,
    sort
  } = {}) {
    const normalized = normalizeTelemetryPagination({ limit, offset, sort })

    const records = await telemetryRepository.findTelemetry({
      machineId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit: normalized.limit,
      offset: normalized.offset,
      sort: normalized.sort
    })

    return toTelemetryOutputList(records)
  }

  return Object.freeze({ createTelemetry, listTelemetry })
}
