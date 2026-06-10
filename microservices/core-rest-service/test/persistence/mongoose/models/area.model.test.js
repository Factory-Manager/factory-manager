import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { AreaModel } from '../../../../src/persistence/mongoose/models/area.model.js'
import {
  AREA_TEST_VALUES,
  createValidAreaData
} from '../../../factories/areas.js'

function createArea(overrides = {}) {
  return new AreaModel(createValidAreaData(overrides))
}

describe('Area model', () => {
  it('creates a valid area', () => {
    const area = createArea()
    const error = area.validateSync()

    assert.equal(error, undefined)
    assert.equal(area.name, AREA_TEST_VALUES.name)
    assert.equal(area.size, AREA_TEST_VALUES.size)
  })

  it('requires name and size', () => {
    const cases = [
      ['name', { name: undefined }],
      ['size', { size: undefined }]
    ]

    for (const [field, overrides] of cases) {
      const error = createArea(overrides).validateSync()
      assert.ok(
        error?.errors[field],
        `expected validation error for field: ${field}`
      )
    }
  })

  it('rejects size below minimum', () => {
    const area = createArea({ size: AREA_TEST_VALUES.invalidSize })
    const error = area.validateSync()

    assert.ok(error?.errors.size)
  })

  it('trims name whitespace', () => {
    const area = createArea({ name: '  Workshop A  ' })
    const error = area.validateSync()

    assert.equal(error, undefined)
    assert.equal(area.name, 'Workshop A')
  })

  it('defines a unique index on name', () => {
    const indexes = AreaModel.schema.indexes()

    assert.ok(
      indexes.some(([fields, options]) => {
        return fields.name === 1 && options.unique === true
      })
    )
  })
})
