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

  /**
   * Creates a not found error.
   *
   * @param {string} [message='Not found'] Public error message.
   * @returns {AppError} Not found application error.
   */
  static notFound(message = 'Not found') {
    return new AppError(message, {
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND
    })
  }

  /**
   * Creates a conflict error.
   *
   * @param {string} [message='Conflict'] Public error message.
   * @returns {AppError} Conflict application error.
   */
  static conflict(message = 'Conflict') {
    return new AppError(message, {
      statusCode: 409,
      code: ERROR_CODES.CONFLICT
    })
  }

  /**
   * Creates a validation error.
   *
   * @param {string} [message='Validation error'] Public error message.
   * @param {Array|Object} [details] Optional validation details.
   * @returns {AppError} Validation application error.
   */
  static validationError(message = 'Validation error', details) {
    return new AppError(message, {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      details
    })
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, {
      statusCode: 401,
      code: ERROR_CODES.UNAUTHORIZED
    })
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, {
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN
    })
  }
}
