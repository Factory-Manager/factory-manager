import pino from 'pino'
import { Logger } from '../../application/ports/logger'

export class PinoLogger implements Logger {
  constructor(private logger = pino()) {}

  child(context: object): Logger {
    return new PinoLogger(this.logger.child(context))
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
