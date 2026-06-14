import { describe, it, expect } from 'vitest'
import { Machine } from '@/domain/machine/machine'
import { fakeConfig } from '@test/utils/fake-config'
import { MACHINE_VALUES } from '@test/constants/machine-values'
import { MachineConfig } from '@/domain/machine/machine-config'
import { MACHINE_LIMITS } from '@test/constants/machine-limits'
import { fakeMachine } from '@test/utils/fake-machine'

describe('Machine', () => {
  it('is equal to another machine with the same id', () => {
    const machine1 = fakeMachine({
      id: 'M1',
      temperature: MACHINE_VALUES.TEMPERATURE.SAFE,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
      emissions: MACHINE_VALUES.EMISSION.SAFE,
      vibration: MACHINE_VALUES.VIBRATION.SAFE,
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    })
    const machine2 = fakeMachine({
      id: 'M1',
      temperature: MACHINE_VALUES.TEMPERATURE.OVER,
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.OVER,
      emissions: MACHINE_VALUES.EMISSION.OVER,
      vibration: MACHINE_VALUES.VIBRATION.OVER,
      pressure: MACHINE_VALUES.PRESSURE.OVER
    })
    expect(machine1.isEqual(machine2)).toBe(true)
  })

  it('is not equal to another machine with different id', () => {
    const machine1 = fakeMachine({ id: 'M1' })
    const machine2 = fakeMachine({ id: 'M2' })
    expect(machine1.isEqual(machine2)).toBe(false)
  })

  it('returns true when temperature exceeds max', () => {
    const machine: Machine = fakeMachine({
      temperature: MACHINE_VALUES.TEMPERATURE.OVER
    })
    const config: MachineConfig = fakeConfig({
      temperature: {
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    expect(machine.isOverheating(config)).toBe(true)
  })

  it('returns false when temperature is below max', () => {
    const machine: Machine = fakeMachine({
      temperature: MACHINE_VALUES.TEMPERATURE.SAFE
    })
    const config: MachineConfig = fakeConfig({
      temperature: {
        max: MACHINE_LIMITS.TEMPERATURE.MAX
      }
    })
    expect(machine.isOverheating(config)).toBe(false)
  })

  it('returns true when temperature is below min', () => {
    const machine: Machine = fakeMachine({
      temperature: MACHINE_VALUES.TEMPERATURE.UNDER
    })
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN
      }
    })
    expect(machine.isUnderheating(config)).toBe(true)
  })

  it('returns false when temperature is above min', () => {
    const machine: Machine = fakeMachine({
      temperature: MACHINE_VALUES.TEMPERATURE.SAFE
    })
    const config: MachineConfig = fakeConfig({
      temperature: {
        min: MACHINE_LIMITS.TEMPERATURE.MIN
      }
    })
    expect(machine.isUnderheating(config)).toBe(false)
  })

  it('returns true when power consumption exceeds max', () => {
    const machine: Machine = fakeMachine({
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.OVER
    })
    const config: MachineConfig = fakeConfig({
      powerConsumption: {
        max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
      }
    })
    expect(machine.isOverconsuming(config)).toBe(true)
  })

  it('returns false when power consumption is below max', () => {
    const machine: Machine = fakeMachine({
      powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE
    })
    const config: MachineConfig = fakeConfig({
      powerConsumption: {
        max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
      }
    })
    expect(machine.isOverconsuming(config)).toBe(false)
  })

  it('returns true when emissions exceed max', () => {
    const machine: Machine = fakeMachine({
      emissions: MACHINE_VALUES.EMISSION.OVER
    })
    const config: MachineConfig = fakeConfig({
      emissions: {
        max: MACHINE_LIMITS.EMISSION.MAX
      }
    })
    expect(machine.isOveremitting(config)).toBe(true)
  })

  it('returns false when emissions are below max', () => {
    const machine: Machine = fakeMachine({
      emissions: MACHINE_VALUES.EMISSION.SAFE
    })
    const config: MachineConfig = fakeConfig({
      emissions: {
        max: MACHINE_LIMITS.EMISSION.MAX
      }
    })
    expect(machine.isOveremitting(config)).toBe(false)
  })

  it('returns true when vibration exceeds max', () => {
    const machine: Machine = fakeMachine({
      vibration: MACHINE_VALUES.VIBRATION.OVER
    })
    const config: MachineConfig = fakeConfig({
      vibration: {
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    expect(machine.isOvervibrating(config)).toBe(true)
  })

  it('returns false when vibration is below max', () => {
    const machine: Machine = fakeMachine({
      vibration: MACHINE_VALUES.VIBRATION.SAFE
    })
    const config: MachineConfig = fakeConfig({
      vibration: {
        max: MACHINE_LIMITS.VIBRATION.MAX
      }
    })
    expect(machine.isOvervibrating(config)).toBe(false)
  })

  it('returns true when pressure exceeds max', () => {
    const machine: Machine = fakeMachine({
      pressure: MACHINE_VALUES.PRESSURE.OVER
    })
    const config: MachineConfig = fakeConfig({
      pressure: {
        max: MACHINE_LIMITS.PRESSURE.MAX
      }
    })
    expect(machine.isOverpressurized(config)).toBe(true)
  })

  it('returns false when pressure is below max', () => {
    const machine: Machine = fakeMachine({
      pressure: MACHINE_VALUES.PRESSURE.SAFE
    })
    const config: MachineConfig = fakeConfig({
      pressure: {
        max: MACHINE_LIMITS.PRESSURE.MAX
      }
    })
    expect(machine.isOverpressurized(config)).toBe(false)
  })
})
