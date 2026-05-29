export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  OPERATOR: 'operator'
})

export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES))

export function isValidUserRole(role) {
  return USER_ROLE_VALUES.includes(role)
}
