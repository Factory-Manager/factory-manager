function handleOffState() {
  return {
    timestamp: new Date(),
    powerConsumption: '0.0',
    emissions: '0.0',
    operatingTemperature: '0.0',
    vibration: '0.0',
    pressure: '0.0',
    anomaly: false
  }
}

module.exports = { handleOffState }
