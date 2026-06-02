import { AppError } from '../errors/app-error.js'
import { ERROR_CODES } from '../errors/error-codes.js'

function isMongoDuplicateKeyError(error) {
  return error.name === 'MongoServerError' && error.code === 11000
}

function isMongooseValidationError(error) {
  return error.name === 'ValidationError'
}

function isInvalidJsonError(error) {
  return error instanceof SyntaxError && error.status === 400
}

/**
 * Sends a consistent API error response.
 *
 * Optional details can be included for validation errors.
 *
 * @param {import('express').Response} res Express response object.
 * @param {Object} errorResponse Error response data.
 * @param {number} errorResponse.statusCode HTTP status code.
 * @param {string} errorResponse.code Public application error code.
 * @param {string} errorResponse.message Public error message.
 * @param {Array|Object} [errorResponse.details] Optional error details.
 */
function sendErrorResponse(res, { statusCode, code, message, details }) {
  const responseBody = {
    code,
    message
  }

  if (details !== undefined) {
    responseBody.details = details
  }

  res.status(statusCode).json(responseBody)
}

/**
 * Express error-handling middleware.
 *
 * Converts expected application, validation, and persistence errors into consistent API error responses,
 * and logs unexpected errors before returning a generic internal server error response.
 *
 * @param {Error} error Error raised by previous middleware or route handlers.
 * @param {import('express').Request} _req Express request object.
 * @param {import('express').Response} res Express a response object.
 * @param {import('express').NextFunction} next Express next function.
 */
export function errorHandler(error, _req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    sendErrorResponse(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details
    })
    return
  }

  if (isMongoDuplicateKeyError(error)) {
    sendErrorResponse(res, {
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'A resource with this value already exists'
    })
    return
  }

  if (isMongooseValidationError(error)) {
    sendErrorResponse(res, {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: error.message
    })
    return
  }

  if (isInvalidJsonError(error)) {
    sendErrorResponse(res, {
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid JSON body'
    })
    return
  }

  console.error('[core-rest-service] Unexpected error', error)

  sendErrorResponse(res, {
    statusCode: 500,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: 'Internal server error'
  })
}
