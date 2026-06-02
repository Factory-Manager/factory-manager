import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createUserService } from '../../../src/application/users/user.service.js'
import {
  createValidCreateUserInput,
  USER_TEST_VALUES
} from '../../factories/users.js'

function createUserServiceTestContext({
  repositoryOptions,
  passwordHasherOptions
} = {}) {
  const userRepository = createUserRepositoryDouble(repositoryOptions)
  const passwordHasher = createPasswordHasherDouble(passwordHasherOptions)

  const userService = createUserService({
    userRepository,
    passwordHasher
  })

  return {
    userService,
    userRepository,
    passwordHasher
  }
}

function createUserRepositoryDouble({
  users = [
    {
      id: 'user-1',
      email: 'operator@fm.com',
      passwordHash: 'hidden-password-hash'
    }
  ]
} = {}) {
  const calls = []

  return {
    calls,

    async createUser(userData) {
      calls.push({
        method: 'createUser',
        userData
      })

      return {
        id: 'created-user',
        ...userData
      }
    },

    async findUserById(id) {
      calls.push({
        method: 'findUserById',
        id
      })

      return {
        id,
        email: 'operator@fm.com',
        passwordHash: 'hidden-password-hash'
      }
    },

    async updateUserById(id, updateData) {
      calls.push({
        method: 'updateUserById',
        id,
        updateData
      })

      return {
        id,
        ...updateData
      }
    },

    async deleteUserById(id) {
      calls.push({
        method: 'deleteUserById',
        id
      })

      return {
        id,
        email: 'operator@fm.com',
        passwordHash: 'hidden-password-hash'
      }
    },

    async findUsers(pagination) {
      calls.push({
        method: 'findUsers',
        pagination
      })

      return users
    }
  }
}

function createPasswordHasherDouble({
  passwordHash = USER_TEST_VALUES.passwordHash
} = {}) {
  const calls = []

  return {
    calls,

    async hashPassword(password) {
      calls.push({
        method: 'hashPassword',
        password
      })

      return passwordHash
    }
  }
}

describe('User service', () => {
  it('requires a user repository', () => {
    assert.throws(
      () =>
        createUserService({
          passwordHasher: createPasswordHasherDouble()
        }),
      {
        name: 'TypeError',
        message: 'userRepository is required'
      }
    )
  })

  it('requires a password hasher', () => {
    assert.throws(
      () =>
        createUserService({
          userRepository: createUserRepositoryDouble()
        }),
      {
        name: 'TypeError',
        message: 'passwordHasher is required'
      }
    )
  })

  it('creates a user with a hashed password and returns public output', async () => {
    const input = createValidCreateUserInput()
    const { userService, userRepository, passwordHasher } =
      createUserServiceTestContext()

    const user = await userService.createUser(input)

    assert.deepEqual(passwordHasher.calls, [
      { method: 'hashPassword', password: USER_TEST_VALUES.password }
    ])
    assert.equal(
      userRepository.calls[0].userData.passwordHash,
      USER_TEST_VALUES.passwordHash
    )
    assert.deepEqual(user, {
      id: 'created-user',
      name: input.name,
      email: input.email,
      role: input.role
    })
  })

  it('omits undefined optional fields from the create data', async () => {
    const input = createValidCreateUserInput({ role: undefined })
    const { userService, userRepository } = createUserServiceTestContext()

    await userService.createUser(input)

    assert.equal('role' in userRepository.calls[0].userData, false)
  })

  it('gets a user by id as public output', async () => {
    const { userService } = createUserServiceTestContext()

    const user = await userService.getUserById('user-id')

    assert.deepEqual(user, {
      id: 'user-id',
      email: 'operator@fm.com'
    })
  })

  it('updates a user without hashing when password is not provided', async () => {
    const { userService, userRepository, passwordHasher } =
      createUserServiceTestContext()

    await userService.updateUserById('user-id', {
      isActive: false
    })

    assert.deepEqual(passwordHasher.calls, [])

    assert.deepEqual(userRepository.calls[0], {
      method: 'updateUserById',
      id: 'user-id',
      updateData: {
        isActive: false
      }
    })
  })

  it('deletes a user and returns public output', async () => {
    const { userService } = createUserServiceTestContext()

    const user = await userService.deleteUserById('user-id')

    assert.deepEqual(user, {
      id: 'user-id',
      email: 'operator@fm.com'
    })
  })

  it('lists users and returns public output', async () => {
    const { userService } = createUserServiceTestContext()

    const users = await userService.listUsers()

    assert.deepEqual(users, [{ id: 'user-1', email: 'operator@fm.com' }])
  })
})
