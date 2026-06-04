import { AppError } from '../errors/app-error.js'

/**
 * Creates middleware that allows only users with one of the given roles.
 *
 * @param {...string} roles Allowed roles.
 * @returns {import('express').RequestHandler}
 */
export function requireRole(...roles) {
  const allowed = new Set(roles)

  return function (req, _res, next) {
    if (!req.auth || !allowed.has(req.auth.role)) {
      throw AppError.forbidden('Insufficient permissions')
    }

    next()
  }
}
