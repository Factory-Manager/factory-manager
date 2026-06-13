const { handleAnomaly } = require('./anomalyHandler')
const { generateRandomSensorData } = require('./sensorDataGenerator')
const { handleOffState } = require('./stateHandler')

/**
 * Generate sensor data for a specific machine based on its current state.
 * @param {Object} machine - Machine document from the database.
 * @returns {Object} Generated sensor data payload.
 */
function generateDataForMachine(machine) {
  let currentValues

  if (machine.machineState.currentState === 'anomaly') {
    currentValues = generateRandomSensorData(machine.specifications)
    currentValues = handleAnomaly(currentValues, machine)
  } else if (machine.machineState.currentState === 'off') {
    currentValues = handleOffState()
  } else {
    currentValues = generateRandomSensorData(machine.specifications)
  }

  return {
    serial: machine.serial,
    machineName: machine.name,
    ...currentValues,
    currentState: machine.machineState.currentState,
    anomalyDetails: machine.machineState.anomalyDetails
  }
}

module.exports = { generateDataForMachine }
