const { getRandomInRange } = require('../utils/sensorUtils')

function generateRandomSensorData(specifications = {}) {
  const {
    powerConsumption: { normalRange: { min: pcMin, max: pcMax } = {} } = {},
    emissions: { normalRange: { min: emMin, max: emMax } = {} } = {},
    operatingTemperature: { normalRange: { min: otMin, max: otMax } = {} } = {},
    vibration: { normalRange: { min: vibMin, max: vibMax } = {} } = {},
    pressure: { normalRange: { min: prMin, max: prMax } = {} } = {}
  } = specifications

  return {
    timestamp: new Date(),
    powerConsumption: getRandomInRange(pcMin, pcMax),
    emissions: getRandomInRange(emMin, emMax),
    operatingTemperature: getRandomInRange(otMin, otMax),
    vibration: getRandomInRange(vibMin, vibMax),
    pressure: getRandomInRange(prMin, prMax),
    anomaly: false
  }
}

module.exports = { generateRandomSensorData }
