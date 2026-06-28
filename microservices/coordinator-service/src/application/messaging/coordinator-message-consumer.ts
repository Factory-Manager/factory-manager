import { MessageProcessor } from './message-processor'
import { Logger } from '../ports/logger'

export class CoordinatorMessageConsumer {
  constructor(
    private readonly processors: MessageProcessor[],
    private readonly logger: Logger
  ) {}

  handle(topic: string, message: Buffer): void {
    try {
      const processor = this.processors.find((p) => p.canHandle(topic))
      if (!processor) {
        return
      }
      processor.process(topic, message)
    } catch (err) {
      this.logger.error('message processing failed', { err, topic })
    }
  }
}
