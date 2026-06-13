const mongoose = require('mongoose')
const { Schema } = mongoose

const sensorDataEntrySchema = new Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  powerConsumption: mongoose.Types.Decimal128,
  emissions: mongoose.Types.Decimal128,
  operatingTemperature: mongoose.Types.Decimal128,
  vibration: mongoose.Types.Decimal128,
  pressure: mongoose.Types.Decimal128,
  anomaly: { type: Boolean, default: false }
})

const machineSensorSchema = new Schema({
  serial: { type: String, required: true },
  sensorData: [sensorDataEntrySchema]
})

module.exports = mongoose.model('MachineSensor', machineSensorSchema)
