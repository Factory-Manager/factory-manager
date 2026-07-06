import { MessageProcessor } from '@/application/messaging/message-processor'
import { ProcessHeartbeat } from '../../heartbeat/process-heartbeat'
import { HeartbeatInput } from '../../heartbeat/dto/heartbeat-input'
import { IncomingMessage } from '../incoming-message'

export class HeartbeatProcessor implements MessageProcessor {
  constructor(
    private readonly processHeartbeat: ProcessHeartbeat,
    private readonly heartbeatTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    const prefix = this.heartbeatTopicPrefix.endsWith('/')
      ? this.heartbeatTopicPrefix
      : `${this.heartbeatTopicPrefix}/`
    return topic.startsWith(prefix)
  }

  process(incomingMessage: IncomingMessage): void {
    const input: HeartbeatInput = {
      machineId: incomingMessage.topic.split('/').pop(),
      ...JSON.parse(incomingMessage.payload.toString())
    }
    this.processHeartbeat.execute(input)
  }
}
