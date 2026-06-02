import { ERROR_CODES } from '../errors/error-codes.js'

/**
 * Handles requests that do not match any registered route.
 * Register this middleware after all routes and other middlewares.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express a response object.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    code: ERROR_CODES.NOT_FOUND,
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
}
