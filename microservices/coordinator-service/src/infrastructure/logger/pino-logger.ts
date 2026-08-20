import pino from 'pino'
import { Logger } from '@/application/ports/logger'
import { NodeEnv } from '@/config/env'

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger

  constructor(
    private readonly nodeEnv: NodeEnv,
    logger?: pino.Logger
  ) {
    this.logger =
      logger ??
      (nodeEnv === 'development'
        ? pino({
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
              }
            },
            level: 'info'
          })
        : pino())
  }

  child(context: object): Logger {
    return new PinoLogger(this.nodeEnv, this.logger.child(context))
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
