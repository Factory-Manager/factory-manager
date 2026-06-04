import jwt from 'jsonwebtoken'

/**
 * Creates a JWT service for signing and verifying tokens.
 *
 * @param {Object} options
 * @param {Function} [options.sign]
 * @param {Function} [options.verify]
 * @param {string} options.secret
 * @param {string} options.expiresIn
 */
export function createJwtService({
  sign = jwt.sign,
  verify = jwt.verify,
  secret,
  expiresIn
}) {
  function generateToken(payload) {
    return sign(payload, secret, { expiresIn })
  }

  function verifyToken(token) {
    return verify(token, secret)
  }

  return Object.freeze({ generateToken, verifyToken, expiresIn })
}
