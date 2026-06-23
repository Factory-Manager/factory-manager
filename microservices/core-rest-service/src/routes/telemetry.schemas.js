import Joi from 'joi'

import { SENSOR_TYPE_VALUES } from '#src/domain/machines/sensor.types.js'

const anomalySchema = Joi.object({
  isAnomaly: Joi.boolean().required(),
  details: Joi.when('isAnomaly', {
    is: true,
    then: Joi.array()
      .items(Joi.string().valid(...SENSOR_TYPE_VALUES))
      .min(1)
      .required(),
    otherwise: Joi.array()
      .items(Joi.string().valid(...SENSOR_TYPE_VALUES))
      .optional()
      .default([])
  })
})

export const createTelemetrySchema = Joi.object({
  eventId: Joi.string().trim().required(),
  machineId: Joi.string().length(24).hex().required(),
  sequenceNumber: Joi.number().integer().min(0).required(),
  capturedAt: Joi.string().isoDate().required(),
  readings: Joi.object({
    powerConsumption: Joi.number().required(),
    emissions: Joi.number().required(),
    operatingTemperature: Joi.number().required(),
    vibration: Joi.number().required(),
    pressure: Joi.number().required()
  }).required(),
  anomaly: anomalySchema.required()
})

export const listTelemetryQuerySchema = Joi.object({
  machineId: Joi.string().length(24).hex().optional(),
  from: Joi.string().isoDate().optional(),
  to: Joi.string().isoDate().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  offset: Joi.number().integer().min(0).optional(),
  sort: Joi.string().valid('asc', 'desc').optional()
})
