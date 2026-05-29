export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  OPERATOR: 'operator'
})

export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES))

const USER_ROLE_SET = new Set(USER_ROLE_VALUES)

export const isValidUserRole = (role) => USER_ROLE_SET.has(role)
