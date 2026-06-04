import { toUserOutput } from '../users/user.serializer.js'

/**
 * Creates the auth application service.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.userRepository
 * @param {Object} dependencies.passwordHasher
 * @param {Object} dependencies.jwtService
 */
export function createAuthService({
  userRepository,
  passwordHasher,
  jwtService
}) {
  if (!userRepository) throw new TypeError('userRepository is required')
  if (!passwordHasher) throw new TypeError('passwordHasher is required')
  if (!jwtService) throw new TypeError('jwtService is required')

  async function login({ email, password }) {
    const user = await userRepository.findUserByEmailForAuth(email)

    if (!user || !user.isActive) {
      return null
    }

    const valid = await passwordHasher.verifyPassword({
      passwordHash: user.passwordHash,
      password
    })

    if (!valid) {
      return null
    }

    const now = new Date()
    const updatedUser = await userRepository.updateLastLoginAt(user._id, now)

    if (!updatedUser) {
      return null
    }
    const token = jwtService.generateToken({
      sub: user._id.toString(),
      role: user.role
    })

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: jwtService.expiresIn,
      user: toUserOutput(updatedUser)
    }
  }

  return Object.freeze({ login })
}
