import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  normalizeUserPagination,
  USER_PAGINATION_POLICY
} from '../../../src/application/users/user.pagination.js'

describe('User pagination', () => {
  it('exports the pagination policy and applies it as defaults', () => {
    assert.deepEqual(USER_PAGINATION_POLICY, {
      defaultLimit: 50,
      defaultOffset: 0,
      maxLimit: 100
    })

    assert.deepEqual(normalizeUserPagination(), {
      limit: USER_PAGINATION_POLICY.defaultLimit,
      offset: USER_PAGINATION_POLICY.defaultOffset
    })
  })

  it('normalizes valid input like string coercion and max cap', () => {
    assert.deepEqual(normalizeUserPagination({ limit: '10', offset: '20' }), {
      limit: 10,
      offset: 20
    })

    assert.deepEqual(normalizeUserPagination({ limit: '999', offset: '0' }), {
      limit: USER_PAGINATION_POLICY.maxLimit,
      offset: 0
    })
  })

  it('falls back to defaults for invalid, out-of-range, or decimal input', () => {
    const { defaultLimit, defaultOffset } = USER_PAGINATION_POLICY

    for (const limit of ['0', '-1', 'abc', '10.5']) {
      const result = normalizeUserPagination({ limit })
      assert.equal(
        result.limit,
        defaultLimit,
        `expected default limit for limit=${limit}`
      )
    }

    for (const offset of ['-1', 'abc', '3.5']) {
      const result = normalizeUserPagination({ limit: '10', offset })
      assert.equal(
        result.offset,
        defaultOffset,
        `expected default offset for offset=${offset}`
      )
    }
  })
})
