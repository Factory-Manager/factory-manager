function toPlainObject(value) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value.toObject === 'function') {
    return value.toObject({ virtuals: true })
  }

  return value
}

function toMachineId(machine) {
  if (machine.id !== undefined) {
    return machine.id
  }

  if (typeof machine._id?.toString === 'function') {
    return machine._id.toString()
  }

  return machine._id
}

function toSpecificationEntry(spec) {
  if (!spec) {
    return undefined
  }

  return {
    measurementUnit: spec.measurementUnit,
    normalRange: spec.normalRange
      ? { min: spec.normalRange.min, max: spec.normalRange.max }
      : undefined
  }
}

/**
 * Converts a machine document or plain object into a public machine output object.
 *
 * @param {object|null|undefined} machine
 * @returns {object|null|undefined}
 */
export function toMachineOutput(machine) {
  const plain = toPlainObject(machine)

  if (plain === null || plain === undefined) {
    return plain
  }

  const specs = plain.specifications ?? {}
  const areaId = plain.location?.areaId

  return {
    id: toMachineId(plain),
    serial: plain.serial,
    name: plain.name,
    location: {
      areaId:
        typeof areaId?.toString === 'function' ? areaId.toString() : areaId
    },
    machineState: {
      currentState: plain.machineState?.currentState,
      anomalyDetails: plain.machineState?.anomalyDetails ?? []
    },
    specifications: {
      powerConsumption: toSpecificationEntry(specs.powerConsumption),
      emissions: toSpecificationEntry(specs.emissions),
      operatingTemperature: toSpecificationEntry(specs.operatingTemperature),
      vibration: toSpecificationEntry(specs.vibration),
      pressure: toSpecificationEntry(specs.pressure)
    },
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt
  }
}

/**
 * Converts machine documents or plain objects into a list of public machine output objects.
 *
 * @param {Array<object>} machines
 * @returns {Array<object>}
 */
export function toMachineOutputList(machines) {
  return machines.map(toMachineOutput)
}
