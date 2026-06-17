import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createMachineRepository } from '#src/persistence/mongoose/repositories/machine.repository.js'
import { createValidMachineData } from '#test/factories/machines.js'

function createQueryResult(result) {
  return { exec: async () => result }
}

function createFindMachinesQueryResult(result, calls) {
  return {
    skip(offset) {
      calls.push({ method: 'skip', offset })
      return {
        limit(limit) {
          calls.push({ method: 'limit', limit })
          return createQueryResult(result)
        }
      }
    }
  }
}

function createMachineModelDouble(overrides = {}) {
  const calls = []

  return {
    calls,

    async create(machineData) {
      calls.push({ method: 'create', machineData })
      return { id: 'created-machine', ...machineData }
    },

    findById(id) {
      calls.push({ method: 'findById', id })
      return createQueryResult({ id })
    },

    findByIdAndUpdate(id, updateData, options) {
      calls.push({ method: 'findByIdAndUpdate', id, updateData, options })
      return createQueryResult({ id, ...updateData })
    },

    findByIdAndDelete(id) {
      calls.push({ method: 'findByIdAndDelete', id })
      return createQueryResult({ id })
    },

    find(filter = {}) {
      calls.push({ method: 'find', filter })
      return createFindMachinesQueryResult([{ id: 'machine-1' }], calls)
    },

    ...overrides
  }
}

describe('Machine repository', () => {
  it('creates a machine', async () => {
    const machineData = createValidMachineData()
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    const machine = await repository.createMachine(machineData)

    assert.deepEqual(machine, { id: 'created-machine', ...machineData })
    assert.deepEqual(machineModel.calls[0], { method: 'create', machineData })
  })

  it('finds a machine by id', async () => {
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    const result = await repository.findMachineById('machine-id')

    assert.deepEqual(result, { id: 'machine-id' })
    assert.deepEqual(machineModel.calls[0], {
      method: 'findById',
      id: 'machine-id'
    })
  })

  it('updates a machine by id with validators enabled', async () => {
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    const result = await repository.updateMachineById('machine-id', {
      name: 'New Name'
    })

    assert.deepEqual(result, { id: 'machine-id', name: 'New Name' })
    assert.deepEqual(machineModel.calls[0], {
      method: 'findByIdAndUpdate',
      id: 'machine-id',
      updateData: { name: 'New Name' },
      options: { new: true, runValidators: true, context: 'query' }
    })
  })

  it('deletes a machine by id', async () => {
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    const result = await repository.deleteMachineById('machine-id')

    assert.deepEqual(result, { id: 'machine-id' })
    assert.deepEqual(machineModel.calls[0], {
      method: 'findByIdAndDelete',
      id: 'machine-id'
    })
  })

  it('finds machines with pagination', async () => {
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    const result = await repository.findMachines({ limit: 10, offset: 20 })

    assert.deepEqual(result, [{ id: 'machine-1' }])
    assert.deepEqual(machineModel.calls, [
      { method: 'find', filter: {} },
      { method: 'skip', offset: 20 },
      { method: 'limit', limit: 10 }
    ])
  })

  it('finds machines filtered by areaId', async () => {
    const machineModel = createMachineModelDouble()
    const repository = createMachineRepository({ machineModel })

    await repository.findMachines({ limit: 10, offset: 0, areaId: 'area-abc' })

    assert.deepEqual(machineModel.calls[0], {
      method: 'find',
      filter: { 'location.areaId': 'area-abc' }
    })
  })

  it('propagates model errors', async () => {
    const expectedError = new Error('database failure')
    const machineModel = {
      create: async () => {
        throw expectedError
      }
    }
    const repository = createMachineRepository({ machineModel })

    await assert.rejects(
      () => repository.createMachine(createValidMachineData()),
      expectedError
    )
  })
})
