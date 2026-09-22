export class InvalidMachineIdError extends Error {
  constructor(machineId: string) {
    super(`MachineId must be a 24-character hexadecimal string: ${machineId}`)
    this.name = 'InvalidMachineIdError'
  }
}
