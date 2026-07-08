import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'

import { AppError } from '#src/errors/app-error.js'

function safeEqual(a, b) {
  const bA = Buffer.from(a)
  const bB = Buffer.from(b)
  return bA.length === bB.length && timingSafeEqual(bA, bB)
}

/**
 * Creates middleware that authenticates requests using a pre-shared service token header.
 * Used by internal services (e.g., Coordinator) that cannot use JWT.
 *
 * @param {Object} dependencies
 * @param {string} [dependencies.serviceToken] Expected value of the X-Service-Token header.
 * @returns {import('express').RequestHandler}
 */
export function createAuthenticateServiceToken({ serviceToken } = {}) {
  return function authenticateServiceToken(req, _res, next) {
    const provided = req.headers['x-service-token']

    if (!serviceToken || !provided || !safeEqual(provided, serviceToken)) {
      throw AppError.unauthorized('Invalid or missing service token')
    }

    next()
  }
}
