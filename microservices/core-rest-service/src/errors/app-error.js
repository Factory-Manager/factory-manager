import { ERROR_CODES } from './error-codes.js'

/**
 * Error used for expected application failures.
 */
export class AppError extends Error {
  /**
   * Creates an application error.
   *
   * @param {string} message Public error message.
   * @param {Object} options Error options.
   * @param {number} options.statusCode HTTP status code.
   * @param {string} options.code Public application error code.
   * @param {Array|Object} [options.details] Optional error details.
   */
  constructor(message, { statusCode, code, details } = {}) {
    super(message)

    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code

    if (details !== undefined) {
      this.details = details
    }
  }

  static notFound(message = 'Not found') {
    return new AppError(message, {
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND
    })
  }

  static conflict(message = 'Conflict') {
    return new AppError(message, {
      statusCode: 409,
      code: ERROR_CODES.CONFLICT
    })
  }

  static validationError(message = 'Validation error', details) {
    return new AppError(message, {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      details
    })
  }
}
