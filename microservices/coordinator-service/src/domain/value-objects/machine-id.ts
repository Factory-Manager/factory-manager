import { InvalidMachineIdError } from '../machine/errors/invalid-machine-id.error'

export class MachineId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidMachineIdError()
    }
  }

  equals(other: MachineId): boolean {
    return this.value === other.value
  }
}
