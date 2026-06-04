import { AppError } from '../errors/app-error.js'

/**
 * Creates middleware that authenticates requests using a Bearer JWT.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.jwtService
 * @returns {import('express').RequestHandler}
 */
export function createAuthenticateRequest({ jwtService }) {
  return function authenticateRequest(req, _res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication required')
    }

    try {
      req.auth = jwtService.verifyToken(authHeader.slice(7))
    } catch {
      throw AppError.unauthorized('Invalid or expired token')
    }

    next()
  }
}
