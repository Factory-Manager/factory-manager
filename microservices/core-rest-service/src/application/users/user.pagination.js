export const USER_PAGINATION_POLICY = Object.freeze({
  defaultLimit: 50,
  defaultOffset: 0,
  maxLimit: 100
})

function toInteger(value, fallback) {
  const numericValue = Number(value)

  if (!Number.isInteger(numericValue)) {
    return fallback
  }

  return numericValue
}

function normalizeLimit(limit) {
  const numericLimit = toInteger(limit, USER_PAGINATION_POLICY.defaultLimit)

  if (numericLimit <= 0) {
    return USER_PAGINATION_POLICY.defaultLimit
  }

  return Math.min(numericLimit, USER_PAGINATION_POLICY.maxLimit)
}

function normalizeOffset(offset) {
  const numericOffset = toInteger(offset, USER_PAGINATION_POLICY.defaultOffset)

  if (numericOffset < 0) {
    return USER_PAGINATION_POLICY.defaultOffset
  }

  return numericOffset
}

/**
 * Normalizes pagination input using the user pagination policy.
 *
 * @param {Object} [pagination={}] Pagination input.
 * @param {number|string} [pagination.limit] Number of items to return.
 * @param {number|string} [pagination.offset] Number of items to skip.
 * @returns {{ limit: number, offset: number }} Normalized pagination values.
 */
export function normalizeUserPagination({
  limit = USER_PAGINATION_POLICY.defaultLimit,
  offset = USER_PAGINATION_POLICY.defaultOffset
} = {}) {
  return {
    limit: normalizeLimit(limit),
    offset: normalizeOffset(offset)
  }
}
