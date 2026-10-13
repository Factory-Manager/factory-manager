import { HeartbeatEvent } from '../heartbeat/dto/heartbeat-event'

/**
 * Repository for managing heartbeat events.
 */
export interface HeartbeatRepository {
  /**
   * Finds the latest heartbeat event for each machine.
   * @param topicPrefix The topic prefix to filter heartbeat events by.
   * @returns An array of the latest heartbeat events for each machine.
   */
  findLatestForEachMachine(topicPrefix: string): HeartbeatEvent[]
}
