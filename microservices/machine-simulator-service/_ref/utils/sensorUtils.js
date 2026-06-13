const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const ANOMALY_MULTIPLIER = 3

function getRandomInRange(min, max) {
  const minValue = min ? parseFloat(min.toString()) : DEFAULT_MIN
  const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX
  return (Math.random() * (maxValue - minValue) + minValue).toFixed(2)
}

function getFarOutsideValue(max) {
  const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX
  return (maxValue * ANOMALY_MULTIPLIER).toFixed(2)
}

function getMicroChangeValue(anomalyValue) {
  const anomalyVal = parseFloat(anomalyValue)
  return (anomalyVal + (Math.random() - 0.5) * 0.001).toFixed(3)
}

module.exports = {
  getRandomInRange,
  getFarOutsideValue,
  getMicroChangeValue
}
