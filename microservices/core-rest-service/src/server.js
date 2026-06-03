import 'dotenv/config'

import { app } from './app.js'
import { logger } from './bootstrap/logger.js'
import { connectToDatabase } from './bootstrap/mongoose.js'
import { env } from './config/env.js'

async function startServer() {
  await connectToDatabase(env.mongoUri)

  app.listen(env.port, () => {
    logger.info(`core-rest-service listening on port ${env.port}`)
  })
}

startServer().catch((error) => {
  logger.error({ err: error }, 'Startup failed')
  process.exit(1)
})
