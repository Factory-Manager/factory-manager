export class MachineNotFoundError extends Error {
  constructor(machineId: string) {
    super(`Machine not found: ${machineId}`)
    this.name = 'MachineNotFoundError'
  }
}
