export class InvalidMachineIdError extends Error {
  constructor() {
    super('MachineId cannot be empty')
  }
}
