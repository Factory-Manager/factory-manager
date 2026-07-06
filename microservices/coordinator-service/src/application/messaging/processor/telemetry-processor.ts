import { MessageProcessor } from '@/application/messaging/message-processor'
import { MachineConfig } from '@/domain/machine/machine-config'
import { ProcessTelemetry } from '../../telemetry/process-telemetry'
import { TelemetryInput } from '../../telemetry/dto/telemetry-input'
import { TelemetryMessageMapper } from '../../telemetry/mapper/map-telemetry-message'
import { IncomingMessage } from '../incoming-message'

export class TelemetryProcessor implements MessageProcessor {
  constructor(
    private readonly processTelemetry: ProcessTelemetry,
    private readonly machineConfig: MachineConfig,
    private readonly telemetryMessageMapper: TelemetryMessageMapper,
    private readonly telemetryTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    const prefix = this.telemetryTopicPrefix.endsWith('/')
      ? this.telemetryTopicPrefix
      : `${this.telemetryTopicPrefix}/`
    return topic.startsWith(prefix)
  }

  process(incomingMessage: IncomingMessage): void {
    const input: TelemetryInput = this.telemetryMessageMapper.map(
      incomingMessage.topic,
      incomingMessage.payload
    )
    this.processTelemetry.execute(input, this.machineConfig)
  }
}
