import { ERROR_CODES } from './error-codes.js'

export class AppError extends Error {
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
