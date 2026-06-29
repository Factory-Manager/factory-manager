import Joi from 'joi'

import { USER_PAGINATION_POLICY } from '#src/application/users/user.pagination.js'
import { PASSWORD_REGEX } from '#src/domain/users/password-policy.js'
import {
  PHONE_NUMBER_REGEX,
  PHONE_PREFIX_REGEX
} from '#src/domain/users/phone-number.js'
import {
  COLOR_FILTER_VALUES,
  THEME_VALUES
} from '#src/domain/users/user-preferences.js'
import { USER_ROLE_VALUES } from '#src/domain/users/user.roles.js'

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

const phoneNumberSchema = Joi.object({
  prefix: Joi.string().trim().pattern(PHONE_PREFIX_REGEX).required(),
  number: Joi.string().trim().pattern(PHONE_NUMBER_REGEX).required()
})

const preferencesSchema = Joi.object({
  theme: Joi.string().valid(...THEME_VALUES)
}).min(1)

const accessibilitySchema = Joi.object({
  colorFilter: Joi.string().valid(...COLOR_FILTER_VALUES)
}).min(1)

export const createUserSchema = Joi.object({
  name: fullNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  role: roleSchema.optional(),
  phoneNumber: phoneNumberSchema.required(),
  preferences: preferencesSchema,
  accessibility: accessibilitySchema
})

export const updateUserSchema = Joi.object({
  name: partialNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  isActive: Joi.boolean(),
  phoneNumber: phoneNumberSchema,
  preferences: preferencesSchema,
  accessibility: accessibilitySchema
}).min(1)

export const userIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
})

export const listUsersQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(USER_PAGINATION_POLICY.maxLimit),
  offset: Joi.number().integer().min(0)
})
