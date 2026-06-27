import { Clock } from '../ports/clock'
import { Logger } from '../ports/logger'
import { HeartbeatInput } from './dto/heartbeat-input'
import { HeartbeatEvent } from './dto/heartbeat-event'

export class ProcessHeartbeat {
  constructor(
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  execute(input: HeartbeatInput): HeartbeatEvent {
    const machineId = input.machineId?.trim()
    if (!machineId) {
      throw new Error('Invalid heartbeat topic')
    }
    const occurredAt = new Date(input.timestamp)
    if (Number.isNaN(occurredAt.getTime())) {
      throw new Error('Invalid heartbeat timestamp')
    }
    const event: HeartbeatEvent = {
      machineId,
      occurredAt,
      receivedAt: this.clock.now()
    }
    this.logger.info('Heartbeat processed', { machineId })
    return event
  }
}
