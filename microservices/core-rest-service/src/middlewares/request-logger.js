import pinoHttp from 'pino-http'
import { logger } from '../bootstrap/logger.js'

const SKIP_PATHS = new Set(['/', '/api/health', '/api/ready'])

export const requestLogger = pinoHttp({
  logger,
  autoLogging: { ignore: (req) => SKIP_PATHS.has(req.url.split('?')[0]) },
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode })
  }
})
