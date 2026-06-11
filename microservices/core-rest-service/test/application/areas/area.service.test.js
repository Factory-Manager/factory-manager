import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createAreaService } from '../../../src/application/areas/area.service.js'
import {
  AREA_TEST_VALUES,
  createValidCreateAreaInput
} from '../../factories/areas.js'

const AREA_OUTPUT = Object.freeze({
  id: 'area-1',
  name: AREA_TEST_VALUES.name,
  size: AREA_TEST_VALUES.size,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
})

function createAreaRepositoryDouble() {
  return {
    async createArea(areaData) {
      return { ...AREA_OUTPUT, ...areaData }
    },
    async findAreaById(_id) {
      return AREA_OUTPUT
    },
    async updateAreaById(_id, _updateData) {
      return AREA_OUTPUT
    },
    async deleteAreaById(_id) {
      return AREA_OUTPUT
    },
    async findAreas(_pagination) {
      return [AREA_OUTPUT]
    }
  }
}

function createAreaServiceTestContext() {
  const areaRepository = createAreaRepositoryDouble()
  const areaService = createAreaService({ areaRepository })
  return { areaService, areaRepository }
}

describe('area service', () => {
  it('creates an area and returns public output', async () => {
    const { areaService } = createAreaServiceTestContext()
    const input = createValidCreateAreaInput()

    const area = await areaService.createArea(input)

    assert.equal(area.id, AREA_OUTPUT.id)
    assert.equal(area.name, AREA_TEST_VALUES.name)
    assert.equal(area.size, AREA_TEST_VALUES.size)
    assert.equal('_id' in area, false)
  })

  it('gets an area by id and returns public output', async () => {
    const { areaService } = createAreaServiceTestContext()

    const area = await areaService.getAreaById('area-1')

    assert.equal(area.id, AREA_OUTPUT.id)
    assert.equal('_id' in area, false)
  })

  it('updates an area and returns public output', async () => {
    const { areaService } = createAreaServiceTestContext()

    const area = await areaService.updateAreaById('area-1', {
      name: 'New Name'
    })

    assert.equal(area.id, AREA_OUTPUT.id)
    assert.equal('_id' in area, false)
  })

  it('deletes an area and returns public output', async () => {
    const { areaService } = createAreaServiceTestContext()

    const area = await areaService.deleteAreaById('area-1')

    assert.equal(area.id, AREA_OUTPUT.id)
    assert.equal('_id' in area, false)
  })

  it('lists areas and returns public output', async () => {
    const { areaService } = createAreaServiceTestContext()

    const areas = await areaService.listAreas()

    assert.equal(Array.isArray(areas), true)
    assert.equal(areas[0].id, AREA_OUTPUT.id)
  })

  it('throws if areaRepository is missing', () => {
    assert.throws(() => createAreaService({}), TypeError)
  })
})
