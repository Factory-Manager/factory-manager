import { MessageProcessor } from '@/application/messaging/message-processor'
import { ProcessHeartbeat } from '../../heartbeat/process-heartbeat'
import { HeartbeatInput } from '../../heartbeat/dto/heartbeat-input'
import { HeartbeatMessageMapper } from '../../heartbeat/mapper/map-heartbeat-message'
import { IncomingMessage } from '../incoming-message'

export class HeartbeatProcessor implements MessageProcessor {
  constructor(
    private readonly processHeartbeat: ProcessHeartbeat,
    private readonly heartbeatMessageMapper: HeartbeatMessageMapper,
    private readonly heartbeatTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    const prefix = this.heartbeatTopicPrefix.endsWith('/')
      ? this.heartbeatTopicPrefix
      : `${this.heartbeatTopicPrefix}/`
    return topic.startsWith(prefix)
  }

  process(incomingMessage: IncomingMessage): void {
    const input: HeartbeatInput = this.heartbeatMessageMapper.map(
      incomingMessage.topic,
      incomingMessage.payload
    )
    this.processHeartbeat.execute(input)
  }
}
