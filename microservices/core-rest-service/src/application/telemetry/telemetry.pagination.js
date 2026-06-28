// sort is specific to telemetry: time-series data is meaningfully ordered by capturedAt
export const TELEMETRY_PAGINATION_POLICY = Object.freeze({
  defaultLimit: 50,
  defaultOffset: 0,
  maxLimit: 100,
  defaultSort: 'desc'
})

function toInteger(value, fallback) {
  const numericValue = Number(value)
  if (!Number.isInteger(numericValue)) return fallback
  return numericValue
}

function normalizeLimit(limit) {
  const n = toInteger(limit, TELEMETRY_PAGINATION_POLICY.defaultLimit)
  if (n <= 0) return TELEMETRY_PAGINATION_POLICY.defaultLimit
  return Math.min(n, TELEMETRY_PAGINATION_POLICY.maxLimit)
}

function normalizeOffset(offset) {
  const n = toInteger(offset, TELEMETRY_PAGINATION_POLICY.defaultOffset)
  if (n < 0) return TELEMETRY_PAGINATION_POLICY.defaultOffset
  return n
}

function normalizeSort(sort) {
  if (sort === 'asc' || sort === 'desc') return sort
  return TELEMETRY_PAGINATION_POLICY.defaultSort
}

/**
 * Normalizes pagination and sort input using the telemetry pagination policy.
 *
 * @param {Object} [params={}]
 * @param {number|string} [params.limit]
 * @param {number|string} [params.offset]
 * @param {string} [params.sort]
 * @returns {{ limit: number, offset: number, sort: string }}
 */
export function normalizeTelemetryPagination({ limit, offset, sort } = {}) {
  return {
    limit: normalizeLimit(limit),
    offset: normalizeOffset(offset),
    sort: normalizeSort(sort)
  }
}
