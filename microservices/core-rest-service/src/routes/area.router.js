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
  areaIdSchema,
  createAreaSchema,
  listAreasQuerySchema,
  updateAreaSchema
} from './area.schemas.js'

function ensureAreaFound(area) {
  if (!area) {
    throw AppError.notFound('Area not found')
  }

  return area
}

/**
 * Creates the area HTTP router.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.areaService
 * @param {import('express').RequestHandler} dependencies.authenticateRequest
 * @returns {import('express').Router}
 */
export function createAreaRouter({ areaService, authenticateRequest }) {
  const router = Router()

  router.post(
    '/',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN, USER_ROLES.OPERATOR),
    validateBody(createAreaSchema),
    async (req, res) => {
      const area = await areaService.createArea(req.body)
      res.status(201).json(area)
    }
  )

  router.get(
    '/',
    authenticateRequest,
    validateQuery(listAreasQuerySchema),
    async (req, res) => {
      const areas = await areaService.listAreas(req.query)
      res.json(areas)
    }
  )

  router.get(
    '/:id',
    authenticateRequest,
    validateParams(areaIdSchema),
    async (req, res) => {
      const area = await areaService.getAreaById(req.params.id)
      res.json(ensureAreaFound(area))
    }
  )

  router.patch(
    '/:id',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN, USER_ROLES.OPERATOR),
    validateParams(areaIdSchema),
    validateBody(updateAreaSchema),
    async (req, res) => {
      const area = await areaService.updateAreaById(req.params.id, req.body)
      res.json(ensureAreaFound(area))
    }
  )

  router.delete(
    '/:id',
    authenticateRequest,
    requireRole(USER_ROLES.ADMIN, USER_ROLES.OPERATOR),
    validateParams(areaIdSchema),
    async (req, res) => {
      const area = await areaService.deleteAreaById(req.params.id)
      ensureAreaFound(area)
      res.sendStatus(204)
    }
  )

  return router
}
