import { AppError } from '#src/errors/app-error.js'

const INVALID_REQUEST_MESSAGE = 'Invalid request'

const DEFAULT_VALIDATION_OPTIONS = Object.freeze({
  abortEarly: false
})

/**
 * Converts validation error details into a public-friendly format.
 *
 * The error is expected to expose a details array with path and message fields.
 */
function toPublicValidationDetails(error) {
  return error.details.map((detail) => ({
    field: Array.isArray(detail.path)
      ? detail.path.join('.')
      : String(detail.path),
    message: detail.message
  }))
}

/**
 * Creates an Express middleware factory for validating a request source.
 *
 * @param {Function} getSource Gets the request source to validate.
 * @param {Function} setSource Replaces the request source with the validated value.
 * @param {Object} [options={}] Validation options.
 * @returns {Function} Express middleware factory.
 */
function createValidator(getSource, setSource, options = {}) {
  return (schema) => (req, _res, next) => {
    const { error, value } = schema.validate(getSource(req), {
      ...DEFAULT_VALIDATION_OPTIONS,
      ...options
    })

    if (error) {
      next(
        AppError.validationError(
          INVALID_REQUEST_MESSAGE,
          toPublicValidationDetails(error)
        )
      )
      return
    }

    setSource(req, value)
    next()
  }
}

/**
 * Validates and sanitizes the request body.
 */
export const validateBody = createValidator(
  (req) => req.body,
  (req, value) => {
    req.body = value
  },
  { stripUnknown: true }
)

/**
 * Validates and normalizes the request path parameters.
 */
export const validateParams = createValidator(
  (req) => req.params,
  (req, value) => {
    req.params = value
  }
)

/**
 * Validates and normalizes the request query parameters.
 */
export const validateQuery = createValidator(
  (req) => req.query,
  (req, value) => {
    Object.assign(req.query, value)
  }
)
