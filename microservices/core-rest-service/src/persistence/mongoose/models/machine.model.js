import mongoose from 'mongoose'

import {
  MACHINE_STATES,
  MACHINE_STATE_VALUES
} from '#src/domain/machines/machine.states.js'
import { SENSOR_TYPE_VALUES } from '#src/domain/machines/sensor.types.js'

const { Schema, model } = mongoose

const specificationSchema = new Schema(
  {
    measurementUnit: { type: String, trim: true },
    normalRange: {
      min: { type: Number },
      max: { type: Number }
    }
  },
  { _id: false }
)

const machineSchema = new Schema(
  {
    serial: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      areaId: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: true
      }
    },
    machineState: {
      currentState: {
        type: String,
        enum: MACHINE_STATE_VALUES,
        required: true,
        default: MACHINE_STATES.OFF
      },
      anomalyDetails: [{ type: String, enum: SENSOR_TYPE_VALUES }]
    },
    specifications: {
      powerConsumption: specificationSchema,
      emissions: specificationSchema,
      operatingTemperature: specificationSchema,
      vibration: specificationSchema,
      pressure: specificationSchema
    }
  },
  { timestamps: true }
)

machineSchema.index({ serial: 1 }, { unique: true })

export const MachineModel = model('Machine', machineSchema)
