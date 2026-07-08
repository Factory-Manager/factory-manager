import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createAreaRepository } from '#src/persistence/mongoose/repositories/area.repository.js'
import { createValidAreaData } from '#test/factories/areas.js'

function createQueryResult(result) {
  return {
    exec: async () => result
  }
}

function createFindAreasQueryResult(result, calls) {
  return {
    sort(sort) {
      calls.push({ method: 'sort', sort })

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
  }
}

function createAreaModelDouble() {
  const calls = []

  return {
    calls,

    async create(areaData) {
      calls.push({ method: 'create', areaData })
      return { id: 'created-area', ...areaData }
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

    find() {
      calls.push({ method: 'find' })
      return createFindAreasQueryResult([{ id: 'area-1' }], calls)
    }
  }
}

describe('Area repository', () => {
  it('creates an area', async () => {
    const areaData = createValidAreaData()
    const areaModel = createAreaModelDouble()
    const repository = createAreaRepository({ areaModel })

    const area = await repository.createArea(areaData)

    assert.deepEqual(area, { id: 'created-area', ...areaData })
    assert.deepEqual(areaModel.calls[0], { method: 'create', areaData })
  })

  it('finds an area by id', async () => {
    const areaModel = createAreaModelDouble()
    const repository = createAreaRepository({ areaModel })

    const result = await repository.findAreaById('area-id')

    assert.deepEqual(result, { id: 'area-id' })
    assert.deepEqual(areaModel.calls[0], { method: 'findById', id: 'area-id' })
  })

  it('updates an area by id with validators enabled', async () => {
    const areaModel = createAreaModelDouble()
    const repository = createAreaRepository({ areaModel })

    const result = await repository.updateAreaById('area-id', { size: 300 })

    assert.deepEqual(result, { id: 'area-id', size: 300 })
    assert.deepEqual(areaModel.calls[0], {
      method: 'findByIdAndUpdate',
      id: 'area-id',
      updateData: { size: 300 },
      options: { new: true, runValidators: true, context: 'query' }
    })
  })

  it('deletes an area by id', async () => {
    const areaModel = createAreaModelDouble()
    const repository = createAreaRepository({ areaModel })

    const result = await repository.deleteAreaById('area-id')

    assert.deepEqual(result, { id: 'area-id' })
    assert.deepEqual(areaModel.calls[0], {
      method: 'findByIdAndDelete',
      id: 'area-id'
    })
  })

  it('finds areas with pagination', async () => {
    const areaModel = createAreaModelDouble()
    const repository = createAreaRepository({ areaModel })

    const result = await repository.findAreas({ limit: 10, offset: 20 })

    assert.deepEqual(result, [{ id: 'area-1' }])
    assert.deepEqual(areaModel.calls, [
      { method: 'find' },
      { method: 'sort', sort: { _id: 1 } },
      { method: 'skip', offset: 20 },
      { method: 'limit', limit: 10 }
    ])
  })

  it('propagates model errors', async () => {
    const expectedError = new Error('database failure')
    const areaModel = {
      create: async () => {
        throw expectedError
      }
    }
    const repository = createAreaRepository({ areaModel })

    await assert.rejects(
      () => repository.createArea(createValidAreaData()),
      expectedError
    )
  })
})
