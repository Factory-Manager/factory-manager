import express from 'express'

import { configureExpress } from './bootstrap/express.js'

const app = express()

configureExpress(app)

export { app }
