import 'dotenv/config'

import { app } from './app.js'
import { logger } from './bootstrap/logger.js'
import {
  connectToDatabase,
  disconnectFromDatabase
} from './bootstrap/mongoose.js'
import { env } from './config/env.js'

async function startServer() {
  await connectToDatabase(env.mongoUri)

  const server = app.listen(env.port, () => {
    logger.info(`core-rest-service listening on port ${env.port}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      disconnectFromDatabase().finally(() => process.exit(0))
    })
  })
}

startServer().catch((error) => {
  logger.error({ err: error }, 'Startup failed')
  process.exit(1)
})
