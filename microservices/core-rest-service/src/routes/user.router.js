import { Router } from 'express'

import { AppError } from '../errors/app-error.js'
import {
  validateBody,
  validateParams,
  validateQuery
} from '../middlewares/validate-request.js'
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
 * @param {Object} dependencies Router dependencies.
 * @param {Object} dependencies.userService User application service.
 * @returns {import('express-serve-static-core').Router} User router.
 */
export function createUserRouter({ userService }) {
  const router = Router()

  router.post('/', validateBody(createUserSchema), async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  })

  router.get('/', validateQuery(listUsersQuerySchema), async (req, res) => {
    const users = await userService.listUsers(req.query)
    res.json(users)
  })

  router.get('/:id', validateParams(userIdSchema), async (req, res) => {
    const user = await userService.getUserById(req.params.id)
    res.json(ensureUserFound(user))
  })

  router.patch(
    '/:id',
    validateParams(userIdSchema),
    validateBody(updateUserSchema),
    async (req, res) => {
      const user = await userService.updateUserById(req.params.id, req.body)
      res.json(ensureUserFound(user))
    }
  )

  router.delete('/:id', validateParams(userIdSchema), async (req, res) => {
    const user = await userService.deleteUserById(req.params.id)
    res.json(ensureUserFound(user))
  })

  return router
}
