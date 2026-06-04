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
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null

    if (!token) {
      throw AppError.unauthorized('Authentication required')
    }

    try {
      req.auth = jwtService.verifyToken(token)
    } catch {
      throw AppError.unauthorized('Invalid or expired token')
    }

    next()
  }
}
