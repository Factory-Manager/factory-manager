import { toUserOutput, toUserOutputList } from './user.serializer.js'
import { normalizeUserPagination } from './user.pagination.js'

function buildCreateUserData(input, passwordHash) {
  return {
    name: {
      first: input.name.first,
      last: input.name.last
    },
    email: input.email,
    passwordHash,
    ...(input.role === undefined ? {} : { role: input.role })
  }
}

function buildNameUpdate(name) {
  if (name === undefined) {
    return {}
  }

  return {
    ...(name.first === undefined ? {} : { 'name.first': name.first }),
    ...(name.last === undefined ? {} : { 'name.last': name.last })
  }
}

async function buildUpdateUserData(input = {}, passwordHasher) {
  const updateData = {
    ...(input.email === undefined ? {} : { email: input.email }),
    ...(input.role === undefined ? {} : { role: input.role }),
    ...(input.isActive === undefined ? {} : { isActive: input.isActive }),
    ...buildNameUpdate(input.name)
  }

  if (input.password === undefined) {
    return updateData
  }

  return {
    ...updateData,
    passwordHash: await passwordHasher.hashPassword(input.password)
  }
}

/**
 * Creates the user application service.
 *
 * @param {Object} serviceDependencies Service dependencies.
 * @param {Object} serviceDependencies.userRepository User repository.
 * @param {Object} serviceDependencies.passwordHasher Password hasher.
 * @returns {Readonly<Object>} User application service.
 */
export function createUserService({ userRepository, passwordHasher }) {
  if (!userRepository) {
    throw new TypeError('userRepository is required')
  }

  if (!passwordHasher) {
    throw new TypeError('passwordHasher is required')
  }

  async function createUser(input) {
    const passwordHash = await passwordHasher.hashPassword(input.password)
    const userData = buildCreateUserData(input, passwordHash)
    const user = await userRepository.createUser(userData)

    return toUserOutput(user)
  }

  async function getUserById(id) {
    const user = await userRepository.findUserById(id)

    return toUserOutput(user)
  }

  async function updateUserById(id, input) {
    const updateData = await buildUpdateUserData(input, passwordHasher)
    const user = await userRepository.updateUserById(id, updateData)

    return toUserOutput(user)
  }

  async function deleteUserById(id) {
    const user = await userRepository.deleteUserById(id)

    return toUserOutput(user)
  }

  async function listUsers(pagination) {
    const users = await userRepository.findUsers(
      normalizeUserPagination(pagination)
    )

    return toUserOutputList(users)
  }

  return Object.freeze({
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    listUsers
  })
}
