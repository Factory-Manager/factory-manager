import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const app = express()

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

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

async function startServer() {
  if (!MONGO_URI) {
    throw new Error('Missing MONGO_URI environment variable')
  }

  await mongoose.connect(MONGO_URI)

  console.log('[core-rest-service] connected to MongoDB')

  app.listen(PORT, () => {
    console.log(`[core-rest-service] listening on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('[core-rest-service] startup failed')
  console.error(error)
  process.exit(1)
})
