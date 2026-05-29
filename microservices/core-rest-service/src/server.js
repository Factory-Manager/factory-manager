import 'dotenv/config'

import { app } from './app.js'
import { connectToDatabase } from './bootstrap/mongoose.js'
import { env } from './config/env.js'

async function startServer() {
  await connectToDatabase(env.mongoUri)

  app.listen(env.port, () => {
    console.log(`[core-rest-service] listening on port ${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('[core-rest-service] startup failed')
  console.error(error)
  process.exit(1)
})
