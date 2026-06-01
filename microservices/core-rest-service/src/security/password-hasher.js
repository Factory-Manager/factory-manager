import argon2 from 'argon2'

/**
 * Argon2ID options used for password hashing.
 *
 * The values are centralized, so the application uses the same hashing parameters everywhere.
 */
export const ARGON2ID_PASSWORD_HASHING_OPTIONS = Object.freeze({
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
})

/**
 * Creates a password hasher.
 *
 * @param {Object} [dependencies]
 * @param {(password: string, options: object) => Promise<string>} [dependencies.hash]
 * @param {(passwordHash: string, password: string) => Promise<boolean>} [dependencies.verify]
 * @param {object} [dependencies.options]
 * @returns {Readonly<{
 *   hashPassword: (password: string) => Promise<string>,
 *   verifyPassword: (credentials: { passwordHash: string, password: string }) => Promise<boolean>
 * }>}
 */
export function createPasswordHasher({
  hash = argon2.hash,
  verify = argon2.verify,
  options = ARGON2ID_PASSWORD_HASHING_OPTIONS
} = {}) {
  async function hashPassword(password) {
    return hash(password, options)
  }

  async function verifyPassword({ passwordHash, password }) {
    return verify(passwordHash, password)
  }

  return Object.freeze({
    hashPassword,
    verifyPassword
  })
}
