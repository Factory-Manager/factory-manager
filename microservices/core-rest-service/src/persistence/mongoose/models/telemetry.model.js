import mongoose from 'mongoose'

import { SENSOR_TYPE_VALUES } from '#src/domain/machines/sensor.types.js'

const { Schema, model } = mongoose

const readingsSchema = new Schema(
  {
    powerConsumption: { type: Number, required: true },
    emissions: { type: Number, required: true },
    operatingTemperature: { type: Number, required: true },
    vibration: { type: Number, required: true },
    pressure: { type: Number, required: true }
  },
  { _id: false }
)

const anomalySchema = new Schema(
  {
    isAnomaly: { type: Boolean, required: true },
    details: [{ type: String, enum: SENSOR_TYPE_VALUES }]
  },
  { _id: false }
)

const telemetrySchema = new Schema(
  {
    eventId: { type: String, required: true, trim: true },
    machineId: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    sequenceNumber: { type: Number, required: true, min: 0 },
    capturedAt: { type: Date, required: true },
    readings: { type: readingsSchema, required: true },
    anomaly: { type: anomalySchema, required: true }
  },
  { timestamps: true }
)

telemetrySchema.index({ eventId: 1 }, { unique: true })
telemetrySchema.index({ machineId: 1, capturedAt: -1 })

export const TelemetryModel = model('Telemetry', telemetrySchema)
