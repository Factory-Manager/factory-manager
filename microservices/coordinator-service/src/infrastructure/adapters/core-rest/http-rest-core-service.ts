import { CoreRestService } from '@/application/ports/core-rest-service'
import { Logger } from '@/application/ports/logger'
import { MachineConfig } from '@/domain'
import { toMachineConfig } from './mapper/machine-config.mapper'
import { MachineDto } from './dto/machine.dto'

export class HttpCoreRestService implements CoreRestService {
  constructor(
    private readonly baseUrl: string,
    private readonly serviceToken: string,
    private readonly logger: Logger
  ) {}

  async getMachineConfigs(params: {
    limit: number
    offset: number
  }): Promise<MachineConfig[]> {
    const searchParams = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString()
    })
    const url = `${this.baseUrl}/api/machines?${searchParams.toString()}`

    this.logger.info(`Getting machine configs via Core REST API at ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': this.serviceToken
      }
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Core REST returned ${response.status}: ${body}`)
    }

    const data: MachineDto[] = await response.json()
    return data.map(toMachineConfig)
  }
}
