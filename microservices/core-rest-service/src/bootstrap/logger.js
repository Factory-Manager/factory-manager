import pino from 'pino'
import { env } from '../config/env.js'

const transport =
  env.nodeEnv === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined

/**
 * The logger instance for the application.
 */
export const logger = pino({
  name: 'core-rest-service',
  level: env.logLevel,
  transport
})
