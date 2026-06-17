import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MACHINE_STATES } from '#src/domain/machines/machine.states.js'
import { ERROR_CODES } from '#src/errors/error-codes.js'
import { createMachineService } from '#src/application/machines/machine.service.js'
import {
  MACHINE_TEST_VALUES,
  createValidCreateMachineInput,
  createValidMachineData
} from '#test/factories/machines.js'

const MACHINE_OUTPUT = Object.freeze({
  id: 'machine-1',
  serial: MACHINE_TEST_VALUES.serial,
  name: MACHINE_TEST_VALUES.name,
  location: { areaId: MACHINE_TEST_VALUES.areaId },
  machineState: { currentState: MACHINE_STATES.OFF, anomalyDetails: [] },
  specifications: {},
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
})

function createMachineRepositoryDouble(overrides = {}) {
  return {
    async createMachine(data) {
      return { ...MACHINE_OUTPUT, ...data }
    },
    async findMachineById(_id) {
      return createValidMachineData({
        machineState: { currentState: MACHINE_STATES.OFF, anomalyDetails: [] }
      })
    },
    async updateMachineById(_id, _updateData) {
      return MACHINE_OUTPUT
    },
    async deleteMachineById(_id) {
      return MACHINE_OUTPUT
    },
    async findMachines(_query) {
      return [MACHINE_OUTPUT]
    },
    ...overrides
  }
}

function createAreaRepositoryDouble(overrides = {}) {
  return {
    async findAreaById(_id) {
      return { id: MACHINE_TEST_VALUES.areaId }
    },
    ...overrides
  }
}

function createServiceTestContext(machineOverrides = {}, areaOverrides = {}) {
  const machineRepository = createMachineRepositoryDouble(machineOverrides)
  const areaRepository = createAreaRepositoryDouble(areaOverrides)
  const machineService = createMachineService({
    machineRepository,
    areaRepository
  })
  return { machineService, machineRepository, areaRepository }
}

describe('machine service', () => {
  it('throws if machineRepository is missing', () => {
    assert.throws(
      () =>
        createMachineService({ areaRepository: createAreaRepositoryDouble() }),
      TypeError
    )
  })

  it('throws if areaRepository is missing', () => {
    assert.throws(
      () =>
        createMachineService({
          machineRepository: createMachineRepositoryDouble()
        }),
      TypeError
    )
  })

  it('creates a machine and returns public output', async () => {
    const { machineService } = createServiceTestContext()
    const input = createValidCreateMachineInput()

    const machine = await machineService.createMachine(input)

    assert.equal(machine.serial, MACHINE_TEST_VALUES.serial)
    assert.equal(machine.machineState?.currentState, MACHINE_STATES.OFF)
    assert.equal('_id' in machine, false)
  })

  it('throws 404 when area not found on create', async () => {
    const { machineService } = createServiceTestContext(
      {},
      {
        async findAreaById(_id) {
          return null
        }
      }
    )

    await assert.rejects(
      () => machineService.createMachine(createValidCreateMachineInput()),
      (err) => err.statusCode === 404
    )
  })

  it('throws 404 when area not found on update with new areaId', async () => {
    const { machineService } = createServiceTestContext(
      {},
      {
        async findAreaById(_id) {
          return null
        }
      }
    )

    await assert.rejects(
      () =>
        machineService.updateMachineById('machine-1', {
          location: { areaId: 'b'.repeat(24) }
        }),
      (err) => err.statusCode === 404
    )
  })

  it('gets a machine by id and returns public output', async () => {
    const { machineService } = createServiceTestContext()

    const machine = await machineService.getMachineById('machine-1')

    assert.ok(machine)
    assert.equal('_id' in machine, false)
  })

  it('returns null when machine not found by id', async () => {
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return null
      }
    })

    const machine = await machineService.getMachineById('missing-id')

    assert.equal(machine, null)
  })

  it('updates a machine and returns public output', async () => {
    const { machineService } = createServiceTestContext()

    const machine = await machineService.updateMachineById('machine-1', {
      name: 'New Name'
    })

    assert.ok(machine)
    assert.equal('_id' in machine, false)
  })

  it('deletes a machine and returns public output', async () => {
    const { machineService } = createServiceTestContext()

    const machine = await machineService.deleteMachineById('machine-1')

    assert.ok(machine)
    assert.equal('_id' in machine, false)
  })

  it('lists machines and returns public output', async () => {
    const { machineService } = createServiceTestContext()

    const machines = await machineService.listMachines({})

    assert.equal(Array.isArray(machines), true)
  })

  it('passes areaId filter to repository', async () => {
    const calls = []
    const { machineService } = createServiceTestContext({
      async findMachines(query) {
        calls.push(query)
        return []
      }
    })

    await machineService.listMachines({ areaId: MACHINE_TEST_VALUES.areaId })

    assert.equal(calls[0].areaId, MACHINE_TEST_VALUES.areaId)
  })

  it('returns null when machine not found on state update', async () => {
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return null
      }
    })

    const result = await machineService.updateMachineState('missing', {
      currentState: MACHINE_STATES.OPERATIONAL
    })

    assert.equal(result, null)
  })

  it('updates machine state for a valid transition', async () => {
    const { machineService } = createServiceTestContext()

    const result = await machineService.updateMachineState('machine-1', {
      currentState: MACHINE_STATES.OPERATIONAL
    })

    assert.ok(result)
  })

  it('throws 422 for an invalid state transition', async () => {
    const { machineService } = createServiceTestContext()

    await assert.rejects(
      () =>
        machineService.updateMachineState('machine-1', {
          currentState: MACHINE_STATES.ANOMALY
        }),
      (err) =>
        err.statusCode === 422 && err.code === ERROR_CODES.INVALID_TRANSITION
    )
  })

  it('throws 400 when anomalyDetails is missing on anomaly transition', async () => {
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return {
          machineState: {
            currentState: MACHINE_STATES.OPERATIONAL,
            anomalyDetails: []
          }
        }
      }
    })

    await assert.rejects(
      () =>
        machineService.updateMachineState('machine-1', {
          currentState: MACHINE_STATES.ANOMALY
        }),
      (err) => err.statusCode === 400
    )
  })

  it('sets anomalyDetails when transitioning to anomaly', async () => {
    const updateCalls = []
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return {
          machineState: {
            currentState: MACHINE_STATES.OPERATIONAL,
            anomalyDetails: []
          }
        }
      },
      async updateMachineById(id, updateData) {
        updateCalls.push(updateData)
        return MACHINE_OUTPUT
      }
    })

    await machineService.updateMachineState('machine-1', {
      currentState: MACHINE_STATES.ANOMALY,
      anomalyDetails: ['vibration']
    })

    assert.deepEqual(updateCalls[0]['machineState.anomalyDetails'], [
      'vibration'
    ])
  })

  it('allows same-state update without throwing', async () => {
    const { machineService } = createServiceTestContext()

    const result = await machineService.updateMachineState('machine-1', {
      currentState: MACHINE_STATES.OFF
    })

    assert.ok(result)
  })

  it('updates anomalyDetails on same-state anomaly update', async () => {
    const updateCalls = []
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return {
          machineState: {
            currentState: MACHINE_STATES.ANOMALY,
            anomalyDetails: ['vibration']
          }
        }
      },
      async updateMachineById(_id, updateData) {
        updateCalls.push(updateData)
        return MACHINE_OUTPUT
      }
    })

    await machineService.updateMachineState('machine-1', {
      currentState: MACHINE_STATES.ANOMALY,
      anomalyDetails: ['pressure', 'emissions']
    })

    assert.deepEqual(updateCalls[0]['machineState.anomalyDetails'], [
      'pressure',
      'emissions'
    ])
  })

  it('clears anomalyDetails when leaving anomaly state', async () => {
    const updateCalls = []
    const { machineService } = createServiceTestContext({
      async findMachineById(_id) {
        return {
          machineState: {
            currentState: MACHINE_STATES.ANOMALY,
            anomalyDetails: ['vibration']
          }
        }
      },
      async updateMachineById(id, updateData) {
        updateCalls.push(updateData)
        return MACHINE_OUTPUT
      }
    })

    await machineService.updateMachineState('machine-1', {
      currentState: MACHINE_STATES.OPERATIONAL
    })

    assert.deepEqual(updateCalls[0]['machineState.anomalyDetails'], [])
  })
})
