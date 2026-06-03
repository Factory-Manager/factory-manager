import pino from 'pino'
import { env } from '../config/env.js'

const transport =
  env.nodeEnv === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname,req,res,responseTime',
          translateTime: 'HH:MM:ss.l',
          singleLine: true
        }
      }
    : undefined

export const logger = pino({
  name: 'core-rest-service',
  level: env.logLevel,
  formatters: {
    level: (label) => ({ level: label })
  },
  transport
})
