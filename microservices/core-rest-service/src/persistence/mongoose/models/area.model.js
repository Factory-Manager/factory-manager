import mongoose from 'mongoose'

const { Schema, model } = mongoose

const areaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
)

areaSchema.index({ name: 1 }, { unique: true })

export const AreaModel = model('Area', areaSchema)
