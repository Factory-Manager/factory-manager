import pino from 'pino'
import { NodeEnv } from '../../config/env'

export class PinoLogger {
  private readonly logger: pino.Logger

  constructor(nodeEnv: NodeEnv) {
    this.logger =
      nodeEnv === 'development'
        ? pino({
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
              }
            }
          })
        : pino()
  }

  info(message: string, metadata?: object): void {
    this.logger.info(metadata ?? {}, message)
  }
  warn(message: string, metadata?: object): void {
    this.logger.warn(metadata ?? {}, message)
  }
  error(message: string, metadata?: object): void {
    this.logger.error(metadata ?? {}, message)
  }
  debug(message: string, metadata?: object): void {
    this.logger.debug(metadata ?? {}, message)
  }
}
