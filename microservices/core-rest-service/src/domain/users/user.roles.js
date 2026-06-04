/** All valid user roles in the system. */
export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  OPERATOR: 'operator'
})

/** Array of all valid role strings, derived from {@link USER_ROLES}. */
export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES))

const USER_ROLE_SET = new Set(USER_ROLE_VALUES)

/**
 * Returns true if the given value is a valid user role.
 *
 * @param {string} role Value to check.
 * @returns {boolean}
 */
export const isValidUserRole = (role) => USER_ROLE_SET.has(role)
