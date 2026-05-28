import 'dotenv/config'

import mongoose from 'mongoose'

import { app } from './app.js'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

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
