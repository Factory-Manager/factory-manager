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
 * Converts a user object to a plain JavaScript object,
 * ensuring that only defined fields are included and that the user ID is properly formatted.
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
