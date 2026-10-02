import { MessageProcessor } from '@/application/messaging/message-processor'
import { ProcessHeartbeat } from '../../heartbeat/process-heartbeat'
import { HeartbeatInput } from '../../heartbeat/dto/heartbeat-input'
import { InboxMessage } from '@/infrastructure/persistence/sqlite/models/inbox-message'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { ConfigurationNotFoundError } from '@/application/errors/configuration-not-found.error'
import { InvalidMachineIdError } from '@/domain/machine/errors/invalid-machine-id.error'

export class HeartbeatProcessor implements MessageProcessor {
  constructor(
    private readonly processHeartbeat: ProcessHeartbeat,
    private readonly machineConfigs: Map<string, MachineConfig>,
    private readonly heartbeatTopicPrefix: string
  ) {}

  canHandle(topic: string): boolean {
    const prefix = this.heartbeatTopicPrefix.endsWith('/')
      ? this.heartbeatTopicPrefix
      : `${this.heartbeatTopicPrefix}/`
    return topic.startsWith(prefix)
  }

  async process(inboxMessage: InboxMessage): Promise<void> {
    const machineId = inboxMessage.topic.split('/').pop()

    if (!machineId) {
      throw new InvalidMachineIdError('')
    }

    const machineIdVO = new MachineId(machineId)
    if (!this.machineConfigs.has(machineIdVO.value)) {
      throw new ConfigurationNotFoundError(machineIdVO.value)
    }

    const input: HeartbeatInput = {
      machineId: machineIdVO.value,
      ...JSON.parse(inboxMessage.payload.toString())
    }
    this.processHeartbeat.execute(input)
  }
}
