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
  createMachineSchema,
  listMachinesQuerySchema,
  machineIdSchema,
  updateMachineSchema,
  updateMachineStateSchema
} from './machine.schemas.js'

function ensureMachineFound(machine) {
  if (!machine) {
    throw AppError.notFound('Machine not found')
  }

  return machine
}

/**
 * Creates the machine HTTP router.
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.machineService
 * @param {import('express').RequestHandler} dependencies.authenticateRequest JWT middleware.
 * @param {import('express').RequestHandler} dependencies.authenticateServiceToken Service token middleware.
 * @returns {import('express').Router}
 */
export function createMachineRouter({
  machineService,
  authenticateRequest,
  authenticateServiceToken
}) {
  const router = Router()
  const requireWriteRole = requireRole(USER_ROLES.ADMIN, USER_ROLES.OPERATOR)

  // Read endpoints accept either a service token (Coordinator bootstrap) or a JWT.
  function authenticateReadOrService(req, res, next) {
    if (req.headers['x-service-token']) {
      return authenticateServiceToken(req, res, next)
    }
    return authenticateRequest(req, res, next)
  }

  // PATCH /state accepts either a service token (Coordinator) or a JWT with write role (manual).
  function authenticateStateUpdate(req, res, next) {
    if (req.headers['x-service-token']) {
      return authenticateServiceToken(req, res, next)
    }

    authenticateRequest(req, res, (err) => {
      if (err) return next(err)
      return requireWriteRole(req, res, next)
    })
  }

  router.post(
    '/',
    authenticateRequest,
    requireWriteRole,
    validateBody(createMachineSchema),
    async (req, res) => {
      const machine = await machineService.createMachine(req.body)
      res.status(201).json(machine)
    }
  )

  router.get(
    '/',
    authenticateReadOrService,
    validateQuery(listMachinesQuerySchema),
    async (req, res) => {
      const machines = await machineService.listMachines(req.query)
      res.json(machines)
    }
  )

  router.get(
    '/:id',
    authenticateReadOrService,
    validateParams(machineIdSchema),
    async (req, res) => {
      const machine = await machineService.getMachineById(req.params.id)
      res.json(ensureMachineFound(machine))
    }
  )

  router.patch(
    '/:id',
    authenticateRequest,
    requireWriteRole,
    validateParams(machineIdSchema),
    validateBody(updateMachineSchema),
    async (req, res) => {
      const machine = await machineService.updateMachineById(
        req.params.id,
        req.body
      )
      res.json(ensureMachineFound(machine))
    }
  )

  router.delete(
    '/:id',
    authenticateRequest,
    requireWriteRole,
    validateParams(machineIdSchema),
    async (req, res) => {
      const machine = await machineService.deleteMachineById(req.params.id)
      res.json(ensureMachineFound(machine))
    }
  )

  router.patch(
    '/:id/state',
    authenticateStateUpdate,
    validateParams(machineIdSchema),
    validateBody(updateMachineStateSchema),
    async (req, res) => {
      const machine = await machineService.updateMachineState(
        req.params.id,
        req.body
      )
      res.json(ensureMachineFound(machine))
    }
  )

  return router
}
