function withoutUndefinedFields(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  )
}

function toPlainObject(value) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value.toObject === 'function') {
    return value.toObject({
      virtuals: true
    })
  }

  return value
}

function toUserId(user) {
  if (user.id !== undefined) {
    return user.id
  }

  if (typeof user._id?.toString === 'function') {
    return user._id.toString()
  }

  return user._id
}

/**
 * Converts a user document or plain object into a public user output object.
 *
 * Only allowlisted fields are included in the returned object.
 *
 * @param {object|null|undefined} user User document or plain user object.
 * @returns {object|null|undefined} Public user output.
 */
export function toUserOutput(user) {
  const plainUser = toPlainObject(user)

  if (plainUser === null || plainUser === undefined) {
    return plainUser
  }

  return withoutUndefinedFields({
    id: toUserId(plainUser),
    name: plainUser.name,
    email: plainUser.email,
    role: plainUser.role,
    isActive: plainUser.isActive,
    lastLoginAt: plainUser.lastLoginAt,
    createdAt: plainUser.createdAt,
    updatedAt: plainUser.updatedAt,
    fullName: plainUser.fullName
  })
}
/**
 * Converts user documents or plain objects into a list of public user output objects.
 *
 * @param {Array<object>} users User documents or plain user objects.
 * @returns {Array<object>} Public user outputs.
 */
export function toUserOutputList(users) {
  return users.map(toUserOutput)
}
