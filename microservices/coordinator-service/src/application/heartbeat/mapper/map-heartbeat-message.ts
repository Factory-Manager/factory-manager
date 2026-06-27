import { HeartbeatInput } from '../dto/heartbeat-input'

export function mapHeartbeatMessage(
  topic: string,
  message: Buffer
): HeartbeatInput {
  return {
    machineId: topic.split('/').pop(),
    ...JSON.parse(message.toString())
  }
}
