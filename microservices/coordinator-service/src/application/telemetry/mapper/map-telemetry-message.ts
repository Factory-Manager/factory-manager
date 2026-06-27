import { TelemetryInput } from '../dto/telemetry-input'

export function mapTelemetryMessage(
  topic: string,
  message: Buffer
): TelemetryInput {
  return {
    machineId: topic.split('/').pop(),
    ...JSON.parse(message.toString())
  }
}
