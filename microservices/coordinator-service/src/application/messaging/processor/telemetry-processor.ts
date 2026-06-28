import { MessageProcessor } from '@/application/messaging/message-processor'
import { MachineConfig } from '@/domain/machine/machine-config'
import { ProcessTelemetry } from '../../telemetry/process-telemetry'
import { TelemetryInput } from '../../telemetry/dto/telemetry-input'
import { TelemetryMessageMapper } from '../../telemetry/mapper/map-telemetry-message'

export class TelemetryProcessor implements MessageProcessor {
  constructor(
    private readonly processTelemetry: ProcessTelemetry,
    private readonly machineConfig: MachineConfig,
    private readonly telemetryMessageMapper: TelemetryMessageMapper,
    private readonly telemetryTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    return topic.startsWith(this.telemetryTopicPrefix)
  }

  process(topic: string, message: Buffer): void {
    const input: TelemetryInput = this.telemetryMessageMapper.map(
      topic,
      message
    )
    this.processTelemetry.execute(input, this.machineConfig)
  }
}
