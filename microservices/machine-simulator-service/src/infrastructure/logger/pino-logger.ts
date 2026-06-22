import pino from 'pino'

export class PinoLogger {
  constructor(
    private logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    })
  ) {}

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
