import Joi from 'joi'

import { USER_PAGINATION_POLICY } from '../application/users/user.pagination.js'
import { USER_ROLE_VALUES } from '../domain/users/user.roles.js'

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

const emailSchema = Joi.string().trim().email()

const roleSchema = Joi.string().valid(...USER_ROLE_VALUES)

const passwordSchema = Joi.string().pattern(PASSWORD_REGEX).messages({
  'string.pattern.base':
    '"password" must contain at least 8 characters, one letter, one number, and one special character'
})

const fullNameSchema = Joi.object({
  first: Joi.string().trim().required(),
  last: Joi.string().trim().required()
})

const partialNameSchema = Joi.object({
  first: Joi.string().trim(),
  last: Joi.string().trim()
}).min(1)

export const createUserSchema = Joi.object({
  name: fullNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  role: roleSchema.optional()
})

export const updateUserSchema = Joi.object({
  name: partialNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  isActive: Joi.boolean()
}).min(1)

export const userIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
})

export const listUsersQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(USER_PAGINATION_POLICY.maxLimit),
  offset: Joi.number().integer().min(0)
})
