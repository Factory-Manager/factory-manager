import { MachineStatus } from '../machine-status'
import { MachineStatusPolicy } from './machine-status-policy'

export class HeartbeatTimeoutPolicy implements MachineStatusPolicy {
  constructor(private readonly timeoutMs: number) {}

  evaluate(lastHeartbeatAt: Date, now: Date): MachineStatus {
    const elapsed = now.getTime() - lastHeartbeatAt.getTime()

    return elapsed >= this.timeoutMs
      ? MachineStatus.OFFLINE
      : MachineStatus.ONLINE
  }
}
