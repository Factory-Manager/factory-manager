export class ConfigurationNotFoundError extends Error {
  constructor(machineId: string) {
    super(`Configuration not found for machine with ID: ${machineId}`)
    this.name = 'ConfigurationNotFoundError'
  }
}
