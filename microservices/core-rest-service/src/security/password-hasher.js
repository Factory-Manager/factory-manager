import argon2 from 'argon2'

export const ARGON2ID_PASSWORD_HASHING_OPTIONS = Object.freeze({
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
})

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

export const passwordHasher = createPasswordHasher()
