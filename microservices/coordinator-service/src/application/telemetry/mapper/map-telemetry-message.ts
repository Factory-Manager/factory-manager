import { MessageMapper } from '@/application/messaging/message-mapper'
import { TelemetryInput } from '../dto/telemetry-input'

export class TelemetryMessageMapper implements MessageMapper<TelemetryInput> {
  map(topic: string, message: Buffer): TelemetryInput {
    const payload = JSON.parse(message.toString())
    return {
      machineId: topic.split('/').pop(),
      ...payload
    }
  }
}
