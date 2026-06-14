import { describe, it, expect } from 'vitest'
import { MachineId } from '@/domain/machine/value-objects/machine-id'
import { InvalidMachineIdError } from '@/domain/machine/errors/invalid-machine-id.error'

describe('MachineId', () => {
  it('throws error when id is empty', () => {
    expect(() => new MachineId('')).toThrow(InvalidMachineIdError)
  })

  it('equals method should return true for same value', () => {
    const id1 = new MachineId('M1')
    const id2 = new MachineId('M1')
    expect(id1.equals(id2)).toBe(true)
  })

  it('equals method should return false for different values', () => {
    const id1 = new MachineId('M1')
    const id2 = new MachineId('M2')
    expect(id1.equals(id2)).toBe(false)
  })
})
