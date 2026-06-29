import { USER_ROLES } from '#src/domain/users/user.roles.js'

export const USER_TEST_VALUES = Object.freeze({
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'Operator@FM.com',
  normalizedEmail: 'operator@fm.com',
  adminEmail: 'Admin@Factory.COM',
  normalizedAdminEmail: 'admin@factory.com',
  password: 'Password123!',
  passwordHash: 'hashed-password',
  role: USER_ROLES.OPERATOR,
  invalidRole: 'moderator',
  fullName: 'Mario Rossi',
  phoneNumber: Object.freeze({ prefix: '+39', number: '3334567890' })
})

export function createValidUserData(overrides = {}) {
  const { name = {}, ...otherOverrides } = overrides

  return {
    name: {
      first: USER_TEST_VALUES.firstName,
      last: USER_TEST_VALUES.lastName,
      ...name
    },
    email: USER_TEST_VALUES.email,
    passwordHash: USER_TEST_VALUES.passwordHash,
    role: USER_TEST_VALUES.role,
    phoneNumber: USER_TEST_VALUES.phoneNumber,
    ...otherOverrides
  }
}

export function createValidCreateUserInput(overrides = {}) {
  const { name = {}, ...otherOverrides } = overrides

  return {
    name: {
      first: USER_TEST_VALUES.firstName,
      last: USER_TEST_VALUES.lastName,
      ...name
    },
    email: USER_TEST_VALUES.email,
    password: USER_TEST_VALUES.password,
    role: USER_TEST_VALUES.role,
    phoneNumber: USER_TEST_VALUES.phoneNumber,
    ...otherOverrides
  }
}
