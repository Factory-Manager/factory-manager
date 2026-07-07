import { MessageProcessor } from '@/application/messaging/message-processor'
import { MachineConfig } from '@/domain/machine/machine-config'
import { ProcessTelemetry } from '../../telemetry/process-telemetry'
import { TelemetryInput } from '../../telemetry/dto/telemetry-input'
import { InboxMessage } from '@/infrastructure/persistence/sqlite/models/inbox-message'

export class TelemetryProcessor implements MessageProcessor {
  constructor(
    private readonly processTelemetry: ProcessTelemetry,
    private readonly machineConfig: MachineConfig,
    private readonly telemetryTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    const prefix = this.telemetryTopicPrefix.endsWith('/')
      ? this.telemetryTopicPrefix
      : `${this.telemetryTopicPrefix}/`
    return topic.startsWith(prefix)
  }

  process(inboxMessage: InboxMessage): void {
    const input: TelemetryInput = {
      machineId: inboxMessage.topic.split('/').pop(),
      ...JSON.parse(inboxMessage.payload.toString())
    }
    this.processTelemetry.execute(input, this.machineConfig)
  }
}
