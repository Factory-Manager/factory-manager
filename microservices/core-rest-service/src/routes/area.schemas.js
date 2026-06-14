import Joi from 'joi'

import { AREA_PAGINATION_POLICY } from '#src/application/areas/area.pagination.js'

export const createAreaSchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().min(1).required()
})

export const updateAreaSchema = Joi.object({
  name: Joi.string().trim(),
  size: Joi.number().min(1)
}).min(1)

export const areaIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
})

export const listAreasQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(AREA_PAGINATION_POLICY.maxLimit),
  offset: Joi.number().integer().min(0)
})
