import pinoHttp from 'pino-http'
import { logger } from '#src/bootstrap/logger.js'

const SKIP_PATHS = new Set(['/', '/api/health', '/api/ready'])

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => {
      const path = req.url.split('?')[0]
      return SKIP_PATHS.has(path) || path.startsWith('/api/docs')
    }
  },
  customSuccessMessage: (req, res, responseTime) =>
    `${req.method} ${req.originalUrl ?? req.url} ${res.statusCode} ${responseTime}ms`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.originalUrl ?? req.url} ${res.statusCode} — ${err.message}`,
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode })
  }
})
