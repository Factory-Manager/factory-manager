import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  AREA_PAGINATION_POLICY,
  normalizeAreaPagination
} from '../../../src/application/areas/area.pagination.js'

describe('area pagination', () => {
  it('exports the pagination policy and applies it as defaults', () => {
    assert.deepEqual(AREA_PAGINATION_POLICY, {
      defaultLimit: 50,
      defaultOffset: 0,
      maxLimit: 100
    })
    assert.deepEqual(normalizeAreaPagination(), { limit: 50, offset: 0 })
  })

  it('normalizes valid input including string coercion and max cap', () => {
    assert.deepEqual(normalizeAreaPagination({ limit: '10', offset: '20' }), {
      limit: 10,
      offset: 20
    })
    assert.deepEqual(normalizeAreaPagination({ limit: '999', offset: '0' }), {
      limit: 100,
      offset: 0
    })
  })

  it('falls back to defaults for invalid, out-of-range, or decimal input', () => {
    const { defaultLimit, defaultOffset } = AREA_PAGINATION_POLICY

    for (const limit of ['0', '-1', 'abc', '10.5']) {
      const result = normalizeAreaPagination({ limit })
      assert.equal(
        result.limit,
        defaultLimit,
        `expected default limit for limit=${limit}`
      )
    }

    for (const offset of ['-1', 'abc', '3.5']) {
      const result = normalizeAreaPagination({ limit: '10', offset })
      assert.equal(
        result.offset,
        defaultOffset,
        `expected default offset for offset=${offset}`
      )
    }
  })
})
