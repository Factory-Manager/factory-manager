import { describe, it, expect } from "vitest"
import { Machine } from "../../src/domain/machine"
import { Temperature } from "../../src/domain/temperature"
import { PowerConsumption } from "../../src/domain/power-consuption"
import { Emission } from "../../src/domain/emission"
import { fakeConfig } from "../utils/fake-config"
import { MACHINE_VALUES } from "../constants/machine-values"
import { MachineConfig } from "../../src/domain/machine-config"
import { MACHINE_LIMITS } from "../constants/machine-limits"

describe("Machine", () => {
    it("returns true when temperature exceeds max", () => {
        const machine: Machine = new Machine(
            "M1",
            new Temperature(MACHINE_VALUES.TEMPERATURE.OVER),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )

        const config: MachineConfig = fakeConfig({
            temperature: {
                max: MACHINE_LIMITS.TEMPERATURE.MAX,
            }
        });

        expect(machine.isOverheating(config)).toBe(true)
    })

    it("returns false when temperature is below max", () => {
        const machine = new Machine(
            "M2",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            temperature: {
                max: MACHINE_LIMITS.TEMPERATURE.MAX,
            }
        })
        expect(machine.isOverheating(config)).toBe(false)
    })

    it("returns true when temperature is below min", () => {
        const machine = new Machine(
            "M2",
            new Temperature(MACHINE_VALUES.TEMPERATURE.UNDER),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            temperature: {
                min: MACHINE_LIMITS.TEMPERATURE.MIN,
            }
        })
        expect(machine.isUnderheating(config)).toBe(true)
    })

    it("returns false when temperature is above min", () => {
        const machine = new Machine(
            "M2",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            temperature: {
                min: MACHINE_LIMITS.TEMPERATURE.MIN,
            }
        })
        expect(machine.isUnderheating(config)).toBe(false)
    })

    it("returns true when power consumption exceeds max", () => {
        const machine = new Machine(
            "M3",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.OVER),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            powerConsumption: {
                max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
            }
        })
        expect(machine.isOverconsuming(config)).toBe(true)
    })

    it("returns false when power consumption is below max", () => {
        const machine = new Machine(
            "M4",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            powerConsumption: {
                max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX
            }
        })
        expect(machine.isOverconsuming(config)).toBe(false)
    })

    it("returns true when emissions exceed max", () => {
        const machine = new Machine(
            "M5",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.OVER)
        )
        const config: MachineConfig = fakeConfig({
            emissions: {
                max: MACHINE_LIMITS.EMISSION.MAX
            }
        })
        expect(machine.isOveremitting(config)).toBe(true)
    })

    it("returns false when emissions are below max", () => {
        const machine = new Machine(
            "M6",
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            emissions: {
                max: MACHINE_LIMITS.EMISSION.MAX
            }
        })
        expect(machine.isOveremitting(config)).toBe(false)
    })
})
