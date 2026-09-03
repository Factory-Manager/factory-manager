import { MachineConfig } from '@/domain/machine/machine-config'
import { ProcessTelemetryResult } from '../telemetry/dto/process-telemetry-result'

/**
 * Defines the interface for the core REST service.
 */
export interface CoreRestService {
  /**
   * Fetches machine configurations from the core REST API.
   * @param params The parameters for fetching machine configurations, including limit and offset.
   * @returns A promise that resolves to an array of MachineConfig objects.
   */
  getMachineConfigs(params: {
    limit: number
    offset: number
  }): Promise<MachineConfig[]>

  /**
   * Publishes telemetry data to the core REST API.
   * @param telemetryData The telemetry data to publish.
   */
  publishTelemetry(telemetryData: ProcessTelemetryResult): Promise<void>
}
