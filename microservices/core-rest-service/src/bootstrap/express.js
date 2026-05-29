import cors from 'cors'
import express from 'express'

import { isDatabaseConnected } from './mongoose.js'

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

  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`
    })
  })
}
