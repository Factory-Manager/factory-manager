import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const app = express()

app.use(cors())
app.use(express.json())

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
  const connected = mongoose.connection.readyState === 1

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

export { app }
