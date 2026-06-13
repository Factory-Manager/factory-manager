const { getMicroChangeValue, getFarOutsideValue } = require('../utils/sensorUtils')

// tracks last anomaly value per sensor field to simulate gradual drift
let lastAnomalyValue = {}

function handleAnomaly(currentValues, machine) {
  if (
    machine.machineState.anomalyDetails &&
    machine.machineState.anomalyDetails.length > 0
  ) {
    currentValues.anomaly = true

    machine.machineState.anomalyDetails.forEach((spec) => {
      const normalMax = parseFloat(
        machine.specifications[spec].normalRange.max.toString()
      )
      const currentValue = parseFloat(currentValues[spec])

      if (
        lastAnomalyValue[spec] &&
        currentValue === parseFloat(lastAnomalyValue[spec])
      ) {
        currentValues[spec] = getMicroChangeValue(currentValue)
      } else if (currentValue > normalMax) {
        currentValues[spec] = getMicroChangeValue(currentValues[spec])
      } else {
        const farOutsideValue = getFarOutsideValue(normalMax)
        currentValues[spec] = farOutsideValue
        lastAnomalyValue[spec] = farOutsideValue
      }
    })
  }
  return currentValues
}

module.exports = { handleAnomaly }
