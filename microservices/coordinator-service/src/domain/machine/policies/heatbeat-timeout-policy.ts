import { MachineReachabilityStatus } from '../machine-reachability-status'
import { MachineStatusPolicy } from './machine-status-policy'

export class HeartbeatTimeoutPolicy implements MachineStatusPolicy {
  constructor(private readonly timeoutMs: number) {}

  evaluate(lastHeartbeatAt: Date, now: Date): MachineReachabilityStatus {
    const elapsed = now.getTime() - lastHeartbeatAt.getTime()

    return elapsed >= this.timeoutMs
      ? MachineReachabilityStatus.OFFLINE
      : MachineReachabilityStatus.ONLINE
  }
}
