import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MACHINE_STATES } from '#src/domain/machines/machine.states.js'
import { MachineModel } from '#src/persistence/mongoose/models/machine.model.js'
import {
  MACHINE_TEST_VALUES,
  createValidMachineData
} from '#test/factories/machines.js'

function createMachine(overrides = {}) {
  return new MachineModel(createValidMachineData(overrides))
}

describe('Machine model', () => {
  it('creates a valid machine', () => {
    const machine = createMachine()
    const error = machine.validateSync()

    assert.equal(error, undefined)
    assert.equal(machine.serial, MACHINE_TEST_VALUES.serial)
    assert.equal(machine.name, MACHINE_TEST_VALUES.name)
    assert.equal(machine.machineState.currentState, MACHINE_STATES.OFF)
  })

  it('requires serial, name, and location.areaId', () => {
    const cases = [
      ['serial', { serial: undefined }],
      ['name', { name: undefined }],
      ['location.areaId', { location: { areaId: undefined } }]
    ]

    for (const [field, overrides] of cases) {
      const error = createMachine(overrides).validateSync()
      assert.ok(error?.errors[field], `expected validation error for ${field}`)
    }
  })

  it('defaults currentState to off', () => {
    const machine = createMachine({ machineState: undefined })
    const error = machine.validateSync()

    assert.equal(error, undefined)
    assert.equal(machine.machineState.currentState, MACHINE_STATES.OFF)
  })

  it('defaults anomalyDetails to empty array', () => {
    const machine = createMachine()
    assert.deepEqual(
      machine.machineState.anomalyDetails.toObject?.() ??
        machine.machineState.anomalyDetails,
      []
    )
  })

  it('rejects invalid currentState', () => {
    const machine = createMachine({
      machineState: { currentState: MACHINE_TEST_VALUES.invalidState }
    })
    const error = machine.validateSync()

    assert.ok(error?.errors['machineState.currentState'])
  })

  it('rejects invalid sensor type in anomalyDetails', () => {
    const machine = createMachine({
      machineState: {
        currentState: MACHINE_STATES.ANOMALY,
        anomalyDetails: [MACHINE_TEST_VALUES.invalidSensorType]
      }
    })
    const error = machine.validateSync()

    assert.ok(error?.errors['machineState.anomalyDetails.0'])
  })

  it('defines a unique index on serial', () => {
    const indexes = MachineModel.schema.indexes()

    assert.ok(
      indexes.some(([fields, options]) => {
        return fields.serial === 1 && options.unique === true
      })
    )
  })
})
