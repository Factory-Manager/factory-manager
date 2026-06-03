import cors from 'cors'
import express from 'express'

import { errorHandler } from '../middlewares/error-handler.js'
import { notFoundHandler } from '../middlewares/not-found-handler.js'
import { configureDocs } from './docs.js'
import { isDatabaseConnected } from './mongoose.js'
import { createUsersBootstrap } from './users.js'
import { env } from '../config/env.js'

export function configureExpress(app) {
  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.disable('etag')

  app.use(cors())
  app.use(express.json({ limit: '20mb' }))
  app.use(express.urlencoded({ limit: '20mb', extended: true }))

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

  if (env.docEnabled) {
    configureDocs(app)
  }

  const { userRouter } = createUsersBootstrap()
  app.use('/api/users', userRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)
}
