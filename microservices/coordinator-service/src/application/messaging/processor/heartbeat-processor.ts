import { MessageProcessor } from '@/application/messaging/message-processor'
import { ProcessHeartbeat } from '../../heartbeat/process-heartbeat'
import { HeartbeatInput } from '../../heartbeat/dto/heartbeat-input'
import { InboxMessage } from '@/infrastructure/persistence/sqlite/models/inbox-message'

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

  async process(inboxMessage: InboxMessage): Promise<void> {
    const input: HeartbeatInput = {
      machineId: inboxMessage.topic.split('/').pop(),
      ...JSON.parse(inboxMessage.payload.toString())
    }
    this.processHeartbeat.execute(input)
  }
}
