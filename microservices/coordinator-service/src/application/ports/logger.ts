export interface Logger {
  info(message: string, metadata?: object): void
  warn(message: string, metadata?: object): void
  error(message: string, metadata?: object): void
  debug(message: string, metadata?: object): void
}
