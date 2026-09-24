import { InvalidMachineIdError } from '../errors/invalid-machine-id.error'

export class MachineId {
  public readonly value: string

  constructor(value: string) {
    const normalizedValue = value.trim()
    if (!/^[a-fA-F0-9]{24}$/.test(normalizedValue)) {
      throw new InvalidMachineIdError(normalizedValue)
    }
    this.value = normalizedValue
  }

  equals(other: MachineId): boolean {
    return this.value === other.value
  }
}
