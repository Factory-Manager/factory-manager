import { Clock } from '@/application/ports/clock'
import { HeartbeatRepository } from '../ports/heartbeats.repository'
import { HeartbeatTimeoutPolicy } from '@/domain/machine/policies/heatbeat-timeout-policy'
import { Logger } from '../ports/logger'
import { CoreRestService } from '../ports/core-rest-service'
import { MachineReachabilityStatus } from '@/domain/machine/machine-reachability-status'
import { MachineNotFoundError } from '../errors/machine-not-found.error'
import { InvalidMachineIdError } from '@/domain/machine/errors/invalid-machine-id.error'
import { MachineId } from '@/domain/machine/value-objects/machine-id'

export class HeartbeatMonitor {
  constructor(
    private readonly heartbeatRepository: HeartbeatRepository,
    private readonly timeoutPolicy: HeartbeatTimeoutPolicy,
    private readonly topicPrefix: string,
    private readonly coreRestService: CoreRestService,
    private readonly clock: Clock,
    private readonly logger: Logger
  ) {}

  async run(): Promise<void> {
    const heartbeats = this.heartbeatRepository.findLatestForEachMachine(
      this.topicPrefix
    )
    const now = this.clock.now()

    for (const heartbeat of heartbeats) {
      const machineId = new MachineId(heartbeat.machineId)
      this.logger.info('Evaluating heartbeat for machine', {
        machineId: machineId.value,
        lastHeartbeatAt: heartbeat.receivedAt,
        now
      })

      const status = this.timeoutPolicy.evaluate(heartbeat.receivedAt, now)

      try {
        if (status === MachineReachabilityStatus.OFFLINE) {
          await this.coreRestService.updateMachineState(
            heartbeat.machineId,
            'off'
          )
        } else if (status === MachineReachabilityStatus.ONLINE) {
          await this.coreRestService.updateMachineState(
            heartbeat.machineId,
            'operational'
          )
        }
      } catch (error) {
        if (
          error instanceof MachineNotFoundError ||
          error instanceof InvalidMachineIdError
        ) {
          this.logger.warn(
            'Ignoring heartbeat for unknown machine or invalid machine ID',
            {
              machineId: heartbeat.machineId
            }
          )
          continue
        }
      }
    }
  }
}
