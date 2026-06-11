export const AREA_PAGINATION_POLICY = Object.freeze({
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
  const numericLimit = toInteger(limit, AREA_PAGINATION_POLICY.defaultLimit)

  if (numericLimit <= 0) {
    return AREA_PAGINATION_POLICY.defaultLimit
  }

  return Math.min(numericLimit, AREA_PAGINATION_POLICY.maxLimit)
}

function normalizeOffset(offset) {
  const numericOffset = toInteger(offset, AREA_PAGINATION_POLICY.defaultOffset)

  if (numericOffset < 0) {
    return AREA_PAGINATION_POLICY.defaultOffset
  }

  return numericOffset
}

/**
 * Normalizes pagination input using the area pagination policy.
 *
 * @param {Object} [pagination={}]
 * @param {number|string} [pagination.limit]
 * @param {number|string} [pagination.offset]
 * @returns {{ limit: number, offset: number }}
 */
export function normalizeAreaPagination({
  limit = AREA_PAGINATION_POLICY.defaultLimit,
  offset = AREA_PAGINATION_POLICY.defaultOffset
} = {}) {
  return {
    limit: normalizeLimit(limit),
    offset: normalizeOffset(offset)
  }
}
