import { MachineStatus } from '../machine-status'

/**
 * A policy that defines how to evaluate the status of a machine based on its last heartbeat timestamp and the current time.
 */
export interface MachineStatusPolicy {
  /**
   * Evaluates the status of a machine based on its last heartbeat timestamp and the current time.
   * @param lastHeartbeatAt The timestamp of the last heartbeat received from the machine.
   * @param now The current timestamp to compare against the last heartbeat.
   * @returns The evaluated status of the machine.
   */
  evaluate(lastHeartbeatAt: Date, now: Date): MachineStatus
}
