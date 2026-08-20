import { Clock } from '@/application/ports/clock'
import { HeartbeatRepository } from '../ports/heartbeats.repository'
import { HeartbeatTimeoutPolicy } from '@/domain/machine/policies/heatbeat-timeout-policy'
import { Logger } from '../ports/logger'

export class HeartbeatMonitor {
  constructor(
    private readonly heartbeatRepository: HeartbeatRepository,
    private readonly timeoutPolicy: HeartbeatTimeoutPolicy,
    private readonly topicPrefix: string,
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  run(): void {
    const heartbeats = this.heartbeatRepository.findLatestForEachMachine(
      this.topicPrefix
    )
    const now = this.clock.now()

    for (const heartbeat of heartbeats) {
      const status = this.timeoutPolicy.evaluate(heartbeat.receivedAt, now)

      this.logger.info('Heartbeat status', {
        machineId: heartbeat.machineId,
        status
      })
    }
  }
}
