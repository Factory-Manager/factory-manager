import { Router } from 'express'

import { USER_ROLES } from '#src/domain/users/user.roles.js'
import { AppError } from '#src/errors/app-error.js'
import { requireRole } from '#src/middlewares/require-role.js'
import {
  validateBody,
  validateParams,
  validateQuery
} from '#src/middlewares/validate-request.js'
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdSchema
} from './user.schemas.js'

function ensureUserFound(user) {
  if (!user) {
    throw AppError.notFound('User not found')
  }

  return user
}

/**
 * Creates the user HTTP router.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.userService
 * @param {import('express').RequestHandler} dependencies.authenticateRequest
 * @returns {import('express').Router}
 */
export function createUserRouter({ userService, authenticateRequest }) {
  const router = Router()

  router.post(
    '/',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN),
    validateBody(createUserSchema),
    async (req, res) => {
      const user = await userService.createUser(req.body)
      res.status(201).json(user)
    }
  )

  router.get(
    '/',
    authenticateRequest,
    validateQuery(listUsersQuerySchema),
    async (req, res) => {
      const users = await userService.listUsers(req.query)
      res.json(users)
    }
  )

  router.get(
    '/:id',
    authenticateRequest,
    validateParams(userIdSchema),
    async (req, res) => {
      const user = await userService.getUserById(req.params.id)
      res.json(ensureUserFound(user))
    }
  )

  router.patch(
    '/:id',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN),
    validateParams(userIdSchema),
    validateBody(updateUserSchema),
    async (req, res) => {
      const user = await userService.updateUserById(req.params.id, req.body)
      res.json(ensureUserFound(user))
    }
  )

  router.delete(
    '/:id',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN),
    validateParams(userIdSchema),
    async (req, res) => {
      const user = await userService.deleteUserById(req.params.id)
      res.json(ensureUserFound(user))
    }
  )

  return router
}
