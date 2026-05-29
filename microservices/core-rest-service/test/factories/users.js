import { USER_ROLES } from '../../src/domain/users/user.roles.js'

export const USER_TEST_VALUES = Object.freeze({
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'Operator@FM.com',
  normalizedEmail: 'operator@fm.com',
  passwordHash: 'hashed-password',
  role: USER_ROLES.OPERATOR,
  invalidRole: 'moderator',
  fullName: 'Mario Rossi'
})

export function createValidUserData(overrides = {}) {
  return {
    name: {
      first: USER_TEST_VALUES.firstName,
      last: USER_TEST_VALUES.lastName,
      ...overrides.name
    },
    email: USER_TEST_VALUES.email,
    passwordHash: USER_TEST_VALUES.passwordHash,
    role: USER_TEST_VALUES.role,
    ...overrides
  }
}
