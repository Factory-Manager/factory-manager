import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { USER_ROLES } from '../../../../src/domain/users/user.roles.js'
import { UserModel } from '../../../../src/persistence/mongoose/models/user.model.js'
import {
  createValidUserData,
  USER_TEST_VALUES
} from '../../../factories/users.js'

function createUser(overrides = {}) {
  return new UserModel(createValidUserData(overrides))
}

describe('User model', () => {
  it('creates a valid user', () => {
    const user = createUser()

    const error = user.validateSync()

    assert.equal(error, undefined)
    assert.equal(user.email, USER_TEST_VALUES.normalizedEmail)
    assert.equal(user.role, USER_TEST_VALUES.role)
    assert.equal(user.isActive, true)
    assert.equal(user.fullName, USER_TEST_VALUES.fullName)
  })

  it('requires first name', () => {
    const user = createUser({
      name: {
        first: undefined
      }
    })

    const error = user.validateSync()

    assert.ok(error.errors['name.first'])
  })

  it('requires last name', () => {
    const user = createUser({
      name: {
        last: undefined
      }
    })

    const error = user.validateSync()

    assert.ok(error.errors['name.last'])
  })

  it('requires email', () => {
    const user = createUser({
      email: undefined
    })

    const error = user.validateSync()

    assert.ok(error.errors.email)
  })

  it('normalizes email to lowercase', () => {
    const user = createUser({
      email: 'Admin@Factory.COM'
    })

    const error = user.validateSync()

    assert.equal(error, undefined)
    assert.equal(user.email, 'admin@factory.com')
  })

  it('requires password hash', () => {
    const user = createUser({
      passwordHash: undefined
    })

    const error = user.validateSync()

    assert.ok(error.errors.passwordHash)
  })

  it('uses operator as default role', () => {
    const user = createUser({
      role: undefined
    })

    const error = user.validateSync()

    assert.equal(error, undefined)
    assert.equal(user.role, USER_ROLES.OPERATOR)
  })

  it('rejects invalid roles', () => {
    const user = createUser({
      role: USER_TEST_VALUES.invalidRole
    })

    const error = user.validateSync()

    assert.ok(error.errors.role)
  })

  it('defines a unique index on email', () => {
    const indexes = UserModel.schema.indexes()

    assert.ok(
      indexes.some(([fields, options]) => {
        return fields.email === 1 && options.unique === true
      })
    )
  })
})
