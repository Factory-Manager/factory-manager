import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  normalizeUserPagination,
  USER_PAGINATION_POLICY
} from '../../../src/application/users/user.pagination.js'

describe('User pagination', () => {
  it('defines the user pagination policy', () => {
    assert.equal(Object.isFrozen(USER_PAGINATION_POLICY), true)

    assert.deepEqual(USER_PAGINATION_POLICY, {
      defaultLimit: 50,
      defaultOffset: 0,
      maxLimit: 100
    })
  })

  it('uses default pagination when input is missing', () => {
    assert.deepEqual(normalizeUserPagination(), {
      limit: USER_PAGINATION_POLICY.defaultLimit,
      offset: USER_PAGINATION_POLICY.defaultOffset
    })
  })

  it('normalizes numeric string pagination values', () => {
    assert.deepEqual(
      normalizeUserPagination({
        limit: '10',
        offset: '20'
      }),
      {
        limit: 10,
        offset: 20
      }
    )
  })

  it('caps limit to the maximum allowed value', () => {
    assert.deepEqual(
      normalizeUserPagination({
        limit: '999',
        offset: '0'
      }),
      {
        limit: USER_PAGINATION_POLICY.maxLimit,
        offset: 0
      }
    )
  })

  it('uses default limit when limit is not a positive integer', () => {
    assert.deepEqual(
      normalizeUserPagination({
        limit: '0',
        offset: '5'
      }),
      {
        limit: USER_PAGINATION_POLICY.defaultLimit,
        offset: 5
      }
    )

    assert.deepEqual(
      normalizeUserPagination({
        limit: '-1',
        offset: '5'
      }),
      {
        limit: USER_PAGINATION_POLICY.defaultLimit,
        offset: 5
      }
    )

    assert.deepEqual(
      normalizeUserPagination({
        limit: 'abc',
        offset: '5'
      }),
      {
        limit: USER_PAGINATION_POLICY.defaultLimit,
        offset: 5
      }
    )
  })

  it('uses default values when pagination values are decimals', () => {
    assert.deepEqual(
      normalizeUserPagination({
        limit: '10.5',
        offset: '3.5'
      }),
      {
        limit: USER_PAGINATION_POLICY.defaultLimit,
        offset: USER_PAGINATION_POLICY.defaultOffset
      }
    )
  })

  it('uses default offset when offset is negative or invalid', () => {
    assert.deepEqual(
      normalizeUserPagination({
        limit: '10',
        offset: '-1'
      }),
      {
        limit: 10,
        offset: USER_PAGINATION_POLICY.defaultOffset
      }
    )

    assert.deepEqual(
      normalizeUserPagination({
        limit: '10',
        offset: 'abc'
      }),
      {
        limit: 10,
        offset: USER_PAGINATION_POLICY.defaultOffset
      }
    )
  })
})
