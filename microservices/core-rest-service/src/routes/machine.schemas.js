import Joi from 'joi'

import { MACHINE_PAGINATION_POLICY } from '#src/application/machines/machine.pagination.js'
import { MACHINE_STATE_VALUES } from '#src/domain/machines/machine.states.js'
import { SENSOR_TYPE_VALUES } from '#src/domain/machines/sensor.types.js'

const normalRangeSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().required().min(Joi.ref('min'))
})

const createSpecificationEntrySchema = Joi.object({
  measurementUnit: Joi.string().trim().required(),
  normalRange: normalRangeSchema.required()
})

const updateSpecificationEntrySchema = Joi.object({
  measurementUnit: Joi.string().trim(),
  normalRange: normalRangeSchema
})

const createSpecificationsSchema = Joi.object({
  powerConsumption: createSpecificationEntrySchema.required(),
  emissions: createSpecificationEntrySchema.required(),
  operatingTemperature: createSpecificationEntrySchema.required(),
  vibration: createSpecificationEntrySchema.required(),
  pressure: createSpecificationEntrySchema.required()
})

const updateSpecificationsSchema = Joi.object({
  powerConsumption: updateSpecificationEntrySchema,
  emissions: updateSpecificationEntrySchema,
  operatingTemperature: updateSpecificationEntrySchema,
  vibration: updateSpecificationEntrySchema,
  pressure: updateSpecificationEntrySchema
})

export const createMachineSchema = Joi.object({
  serial: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  location: Joi.object({
    areaId: Joi.string().length(24).hex().required()
  }).required(),
  specifications: createSpecificationsSchema.required()
})

export const updateMachineSchema = Joi.object({
  serial: Joi.string().trim(),
  name: Joi.string().trim(),
  location: Joi.object({
    areaId: Joi.string().length(24).hex()
  }),
  specifications: updateSpecificationsSchema
}).min(1)

export const updateMachineStateSchema = Joi.object({
  currentState: Joi.string()
    .valid(...MACHINE_STATE_VALUES)
    .required(),
  anomalyDetails: Joi.array().items(Joi.string().valid(...SENSOR_TYPE_VALUES))
})

export const machineIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
})

export const listMachinesQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(MACHINE_PAGINATION_POLICY.maxLimit),
  offset: Joi.number().integer().min(0),
  areaId: Joi.string().length(24).hex()
})
