require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

async function startServer() {
  app.listen(PORT, () => {
    console.log(`[core-rest-service] listening on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('[core-rest-service] startup failed')
  console.error(error)
  process.exit(1)
})
