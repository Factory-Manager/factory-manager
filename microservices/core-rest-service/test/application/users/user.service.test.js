import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createUserService } from '../../../src/application/users/user.service.js'
import {
  createValidCreateUserInput,
  USER_TEST_VALUES
} from '../../factories/users.js'

function createUserRepositoryDouble({
  foundUser = null,
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

    async findUserByEmail(email) {
      calls.push({
        method: 'findUserByEmail',
        email
      })

      return foundUser
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
    const input = createValidCreateUserInput({
      passwordHash: 'malicious-password-hash'
    })
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    const user = await userService.createUser(input)

    assert.deepEqual(passwordHasher.calls, [
      {
        method: 'hashPassword',
        password: USER_TEST_VALUES.password
      }
    ])

    assert.deepEqual(userRepository.calls[0], {
      method: 'createUser',
      userData: {
        name: input.name,
        email: input.email,
        passwordHash: USER_TEST_VALUES.passwordHash,
        role: input.role
      }
    })

    assert.deepEqual(user, {
      id: 'created-user',
      name: input.name,
      email: input.email,
      role: input.role
    })
  })

  it('omits role when it is not provided during user creation', async () => {
    const input = createValidCreateUserInput({
      role: undefined
    })
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    await userService.createUser(input)

    assert.deepEqual(userRepository.calls[0], {
      method: 'createUser',
      userData: {
        name: input.name,
        email: input.email,
        passwordHash: USER_TEST_VALUES.passwordHash
      }
    })
  })

  it('gets a user by id as public output', async () => {
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    const user = await userService.getUserById('user-id')

    assert.deepEqual(user, {
      id: 'user-id',
      email: 'operator@fm.com'
    })
  })

  it('updates a user without hashing when password is not provided', async () => {
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

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
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    const user = await userService.deleteUserById('user-id')

    assert.deepEqual(user, {
      id: 'user-id',
      email: 'operator@fm.com'
    })
  })

  it('lists users with default pagination', async () => {
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    const users = await userService.listUsers()

    assert.deepEqual(userRepository.calls[0], {
      method: 'findUsers',
      pagination: {
        limit: 50,
        offset: 0
      }
    })

    assert.deepEqual(users, [
      {
        id: 'user-1',
        email: 'operator@fm.com'
      }
    ])
  })

  it('lists users with provided pagination', async () => {
    const userRepository = createUserRepositoryDouble()
    const passwordHasher = createPasswordHasherDouble()
    const userService = createUserService({
      userRepository,
      passwordHasher
    })

    await userService.listUsers({
      limit: 10,
      offset: 20
    })

    assert.deepEqual(userRepository.calls[0], {
      method: 'findUsers',
      pagination: {
        limit: 10,
        offset: 20
      }
    })
  })
})
