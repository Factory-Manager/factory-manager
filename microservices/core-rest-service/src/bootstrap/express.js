import cors from 'cors'
import express from 'express'

import { env } from '#src/config/env.js'
import { errorHandler } from '#src/middlewares/error-handler.js'
import { notFoundHandler } from '#src/middlewares/not-found-handler.js'
import { requestLogger } from '#src/middlewares/request-logger.js'
import { createAreaRouter } from '#src/routes/area.router.js'
import { createUserRouter } from '#src/routes/user.router.js'
import { createAreasBootstrap } from './areas.js'
import { createAuthBootstrap } from './auth.js'
import { configureDocs } from './docs.js'
import { isDatabaseConnected } from './mongoose.js'
import { createUsersBootstrap } from './users.js'

export function configureExpress(app) {
  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.disable('etag')

  app.use(cors())
  app.use(express.json({ limit: '20mb' }))
  app.use(express.urlencoded({ limit: '20mb', extended: true }))
  app.use(requestLogger)

  app.get('/', (_req, res) => {
    res.json({
      service: 'core-rest-service',
      status: 'running'
    })
  })

  app.get('/api/health', (_req, res) => {
    res.json({
      service: 'core-rest-service',
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  })

  app.get('/api/ready', (_req, res) => {
    const connected = isDatabaseConnected()

    res.status(connected ? 200 : 503).json({
      service: 'core-rest-service',
      ready: connected,
      database: {
        connected
      }
    })
  })

  if (env.docsEnabled) {
    configureDocs(app)
  }

  const { authRouter, authenticateRequest } = createAuthBootstrap()
  app.use('/api/auth', authRouter)

  const { userService } = createUsersBootstrap()
  app.use('/api/users', createUserRouter({ userService, authenticateRequest }))

  const { areaService } = createAreasBootstrap()
  app.use('/api/areas', createAreaRouter({ areaService, authenticateRequest }))

  app.use(notFoundHandler)
  app.use(errorHandler)
}
