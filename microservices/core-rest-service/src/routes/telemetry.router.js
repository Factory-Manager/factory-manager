import { Router } from 'express'

import {
  validateBody,
  validateQuery
} from '#src/middlewares/validate-request.js'
import {
  createTelemetrySchema,
  listTelemetryQuerySchema
} from './telemetry.schemas.js'

/**
 * Creates the telemetry HTTP router.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.telemetryService
 * @param {import('express').RequestHandler} dependencies.authenticateRequest JWT middleware.
 * @param {import('express').RequestHandler} dependencies.authenticateServiceToken Service token middleware.
 * @returns {import('express').Router}
 */
export function createTelemetryRouter({
  telemetryService,
  authenticateRequest,
  authenticateServiceToken
}) {
  const router = Router()

  router.post(
    '/',
    authenticateServiceToken,
    validateBody(createTelemetrySchema),
    async (req, res) => {
      const record = await telemetryService.createTelemetry(req.body)
      res.status(201).json(record)
    }
  )

  router.get(
    '/',
    authenticateRequest,
    validateQuery(listTelemetryQuerySchema),
    async (req, res) => {
      const records = await telemetryService.listTelemetry(req.query)
      res.json(records)
    }
  )

  return router
}
