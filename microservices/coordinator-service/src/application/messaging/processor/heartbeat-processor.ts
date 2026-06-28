import { MessageProcessor } from '@/application/messaging/message-processor'
import { ProcessHeartbeat } from '../../heartbeat/process-heartbeat'
import { HeartbeatInput } from '../../heartbeat/dto/heartbeat-input'
import { HeartbeatMessageMapper } from '../../heartbeat/mapper/map-heartbeat-message'

export class HeartbeatProcessor implements MessageProcessor {
  constructor(
    private readonly processHeartbeat: ProcessHeartbeat,
    private readonly heartbeatMessageMapper: HeartbeatMessageMapper,
    private readonly heartbeatTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    return topic.startsWith(this.heartbeatTopicPrefix)
  }

  process(topic: string, message: Buffer): void {
    const input: HeartbeatInput = this.heartbeatMessageMapper.map(
      topic,
      message
    )
    this.processHeartbeat.execute(input)
  }
}
