function toPlainObject(value) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value.toObject === 'function') {
    return value.toObject({ virtuals: true })
  }

  return value
}

/**
 * Converts a telemetry document or plain object into a public telemetry output object.
 *
 * @param {object|null|undefined} record
 * @returns {object|null|undefined}
 */
export function toTelemetryOutput(record) {
  const plain = toPlainObject(record)

  if (plain === null || plain === undefined) {
    return plain
  }

  const id =
    plain.id !== undefined
      ? plain.id
      : typeof plain._id?.toString === 'function'
        ? plain._id.toString()
        : plain._id

  const machineId =
    typeof plain.machineId?.toString === 'function'
      ? plain.machineId.toString()
      : plain.machineId

  return {
    id,
    eventId: plain.eventId,
    machineId,
    sequenceNumber: plain.sequenceNumber,
    capturedAt: plain.capturedAt,
    readings: {
      powerConsumption: plain.readings?.powerConsumption,
      emissions: plain.readings?.emissions,
      operatingTemperature: plain.readings?.operatingTemperature,
      vibration: plain.readings?.vibration,
      pressure: plain.readings?.pressure
    },
    anomaly: {
      isAnomaly: plain.anomaly?.isAnomaly,
      details: plain.anomaly?.details ?? []
    },
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt
  }
}

/**
 * Converts telemetry documents or plain objects into a list of public telemetry output objects.
 *
 * @param {Array<object>} records
 * @returns {Array<object>}
 */
export function toTelemetryOutputList(records) {
  return records.map(toTelemetryOutput)
}
