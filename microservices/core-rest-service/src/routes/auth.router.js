import { Router } from 'express'

import { AppError } from '../errors/app-error.js'
import { validateBody } from '../middlewares/validate-request.js'
import { loginSchema } from './auth.schemas.js'

/**
 * Creates the auth HTTP router.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.authService
 * @returns {import('express').Router}
 */
export function createAuthRouter({ authService }) {
  const router = Router()

  router.post('/login', validateBody(loginSchema), async (req, res) => {
    const result = await authService.login(req.body)

    if (!result) {
      throw AppError.unauthorized('Invalid credentials')
    }

    res.json(result)
  })

  router.post('/logout', (_req, res) => {
    res.sendStatus(204)
  })

  return router
}
