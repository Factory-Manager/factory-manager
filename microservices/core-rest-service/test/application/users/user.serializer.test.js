import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { toUserOutput } from '../../../src/application/users/user.serializer.js'

describe('User mapper', () => {
  it('maps a plain user to public output', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z')
    const updatedAt = new Date('2026-01-02T00:00:00.000Z')

    const user = {
      _id: {
        toString: () => 'user-id'
      },
      name: {
        first: 'Mario',
        last: 'Rossi'
      },
      email: 'operator@fm.com',
      password: 'plain-password',
      passwordHash: 'hashed-password',
      role: 'operator',
      isActive: true,
      lastLoginAt: null,
      createdAt,
      updatedAt,
      fullName: 'Mario Rossi',
      internalNotes: 'secret'
    }

    const output = toUserOutput(user)

    assert.deepEqual(output, {
      id: 'user-id',
      name: {
        first: 'Mario',
        last: 'Rossi'
      },
      email: 'operator@fm.com',
      role: 'operator',
      isActive: true,
      lastLoginAt: null,
      createdAt,
      updatedAt,
      fullName: 'Mario Rossi'
    })
  })

  it('maps a Mongoose-like document to public output', () => {
    const userDocument = {
      toObject: () => ({
        id: 'user-id',
        name: {
          first: 'Mario',
          last: 'Rossi'
        },
        email: 'operator@fm.com',
        passwordHash: 'hashed-password',
        role: 'operator',
        isActive: true,
        fullName: 'Mario Rossi'
      })
    }

    const output = toUserOutput(userDocument)

    assert.deepEqual(output, {
      id: 'user-id',
      name: {
        first: 'Mario',
        last: 'Rossi'
      },
      email: 'operator@fm.com',
      role: 'operator',
      isActive: true,
      fullName: 'Mario Rossi'
    })
  })

  it('returns null and undefined as they are', () => {
    assert.equal(toUserOutput(null), null)
    assert.equal(toUserOutput(undefined), undefined)
  })
})
