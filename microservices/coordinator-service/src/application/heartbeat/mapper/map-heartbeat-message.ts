import { MessageMapper } from '@/application/messaging/message-mapper'
import { HeartbeatInput } from '../dto/heartbeat-input'

export class HeartbeatMessageMapper implements MessageMapper<HeartbeatInput> {
  map(topic: string, message: Buffer): HeartbeatInput {
    const payload = JSON.parse(message.toString())
    return {
      machineId: topic.split('/').pop(),
      ...payload
    }
  }
}
