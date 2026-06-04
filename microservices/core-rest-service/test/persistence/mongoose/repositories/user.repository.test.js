import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createUserRepository } from '../../../../src/persistence/mongoose/repositories/user.repository.js'
import { createValidUserData } from '../../../factories/users.js'

function createQueryResult(result) {
  return {
    exec: async () => result
  }
}

function createFindUsersQueryResult(result, calls) {
  return {
    skip(offset) {
      calls.push({
        method: 'skip',
        offset
      })

      return {
        limit(limit) {
          calls.push({
            method: 'limit',
            limit
          })

          return createQueryResult(result)
        }
      }
    }
  }
}

function createUserModelDouble() {
  const calls = []

  return {
    calls,

    async create(userData) {
      calls.push({
        method: 'create',
        userData
      })

      return {
        id: 'created-user',
        ...userData
      }
    },

    findOne(query) {
      calls.push({
        method: 'findOne',
        query
      })

      return createQueryResult({
        id: 'found-user',
        query
      })
    },

    findById(id) {
      calls.push({
        method: 'findById',
        id
      })

      return createQueryResult({
        id
      })
    },

    findByIdAndUpdate(id, updateData, options) {
      calls.push({
        method: 'findByIdAndUpdate',
        id,
        updateData,
        options
      })

      return createQueryResult({
        id,
        ...updateData
      })
    },

    findByIdAndDelete(id) {
      calls.push({
        method: 'findByIdAndDelete',
        id
      })

      return createQueryResult({
        id
      })
    },

    find() {
      calls.push({
        method: 'find'
      })

      return createFindUsersQueryResult(
        [
          {
            id: 'user-1'
          }
        ],
        calls
      )
    }
  }
}

describe('User repository', () => {
  it('creates a user', async () => {
    const userData = createValidUserData()
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const user = await repository.createUser(userData)

    assert.deepEqual(user, {
      id: 'created-user',
      ...userData
    })

    assert.deepEqual(userModel.calls[0], {
      method: 'create',
      userData
    })
  })

  it('finds a user by email', async () => {
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const result = await repository.findUserByEmail('operator@factory.com')

    assert.deepEqual(result, {
      id: 'found-user',
      query: {
        email: 'operator@factory.com'
      }
    })

    assert.deepEqual(userModel.calls[0], {
      method: 'findOne',
      query: {
        email: 'operator@factory.com'
      }
    })
  })

  it('finds a user by email including passwordHash', async () => {
    const selectCalls = []
    const userModel = {
      findOne(query) {
        return {
          select(fields) {
            selectCalls.push(fields)
            return { exec: async () => ({ id: 'found-user', query }) }
          }
        }
      }
    }
    const repository = createUserRepository({ userModel })

    const result = await repository.findUserByEmailForAuth(
      'operator@factory.com'
    )

    assert.deepEqual(result, {
      id: 'found-user',
      query: { email: 'operator@factory.com' }
    })
    assert.deepEqual(selectCalls, ['+passwordHash'])
  })

  it('finds a user by id', async () => {
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const result = await repository.findUserById('user-id')

    assert.deepEqual(result, {
      id: 'user-id'
    })

    assert.deepEqual(userModel.calls[0], {
      method: 'findById',
      id: 'user-id'
    })
  })

  it('updates a user by id with validators enabled', async () => {
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const updateData = {
      isActive: false
    }

    const result = await repository.updateUserById('user-id', updateData)

    assert.deepEqual(result, {
      id: 'user-id',
      isActive: false
    })

    assert.deepEqual(userModel.calls[0], {
      method: 'findByIdAndUpdate',
      id: 'user-id',
      updateData,
      options: {
        new: true,
        runValidators: true,
        context: 'query'
      }
    })
  })

  it('updates lastLoginAt for a user', async () => {
    const date = new Date('2026-06-01T10:00:00.000Z')
    const calls = []
    const userModel = {
      findByIdAndUpdate(id, updateData, options) {
        calls.push({ id, updateData, options })
        return { exec: async () => ({ id, ...updateData }) }
      }
    }
    const repository = createUserRepository({ userModel })

    const result = await repository.updateLastLoginAt('user-id', date)

    assert.deepEqual(result, { id: 'user-id', lastLoginAt: date })
    assert.deepEqual(calls, [
      {
        id: 'user-id',
        updateData: { lastLoginAt: date },
        options: { new: true, runValidators: true, context: 'query' }
      }
    ])
  })

  it('deletes a user by id', async () => {
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const result = await repository.deleteUserById('user-id')

    assert.deepEqual(result, {
      id: 'user-id'
    })

    assert.deepEqual(userModel.calls[0], {
      method: 'findByIdAndDelete',
      id: 'user-id'
    })
  })

  it('finds users with pagination', async () => {
    const userModel = createUserModelDouble()
    const repository = createUserRepository({ userModel })

    const result = await repository.findUsers({
      limit: 10,
      offset: 20
    })

    assert.deepEqual(result, [
      {
        id: 'user-1'
      }
    ])

    assert.deepEqual(userModel.calls, [
      {
        method: 'find'
      },
      {
        method: 'skip',
        offset: 20
      },
      {
        method: 'limit',
        limit: 10
      }
    ])
  })

  it('propagates model errors', async () => {
    const expectedError = new Error('database failure')
    const userModel = {
      create: async () => {
        throw expectedError
      }
    }

    const repository = createUserRepository({ userModel })

    await assert.rejects(
      () => repository.createUser(createValidUserData()),
      expectedError
    )
  })
})
