import { MachineStatus } from '../machine-status'
import { MachineStatusPolicy } from './machine-status-policy'

export class HeartbeatTimeoutPolicy implements MachineStatusPolicy {
  constructor(private readonly timeoutMs: number) {}

  evaluate(lastHeartbeatAt: Date, now: Date): MachineStatus {
    const elapsed = now.getTime() - lastHeartbeatAt.getTime()

    if (elapsed >= this.timeoutMs) {
      return MachineStatus.OFFLINE
    }

    return MachineStatus.ONLINE
  }
}
