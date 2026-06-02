import { describe, it, expect } from "vitest"
import { Machine } from "../../../src/domain/machine/machine"
import { Temperature } from "../../../src/domain/value-objects/temperature"
import { PowerConsumption } from "../../../src/domain/value-objects/power-consuption"
import { Emission } from "../../../src/domain/value-objects/emission"
import { fakeConfig } from "../../utils/fake-config"
import { MACHINE_VALUES } from "../../constants/machine-values"
import { MachineConfig } from "../../../src/domain/machine/machine-config"
import { MACHINE_LIMITS } from "../../constants/machine-limits"
import { Vibration } from "../../../src/domain/value-objects/vibration"
import { Pressure } from "../../../src/domain/value-objects/pressure"
import { MachineId } from "../../../src/domain/value-objects/machine-id"

describe("Machine", () => {

    it("is equal to another machine with the same id", () => {
        const machine1 = new Machine(
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )

        const machine2 = new Machine(
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.OVER),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.OVER),
            new Emission(MACHINE_VALUES.EMISSION.OVER),
            new Vibration(MACHINE_VALUES.VIBRATION.OVER),
            new Pressure(MACHINE_VALUES.PRESSURE.OVER)
        )

        expect(machine1.isEqual(machine2)).toBe(true)
    })

    it("is not equal to another machine with different id", () => {
        const machine1 = new Machine(
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )

        const machine2 = new Machine(
            new MachineId("M2"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )

        expect(machine1.isEqual(machine2)).toBe(false)
    })

    it("returns true when temperature exceeds max", () => {
        const machine: Machine = new Machine(
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.OVER),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.UNDER),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M1"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE),
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
            new MachineId("M2"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.OVER),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M2"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M3"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.OVER),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
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
            new MachineId("M3"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            emissions: {
                max: MACHINE_LIMITS.EMISSION.MAX
            }
        })
        expect(machine.isOveremitting(config)).toBe(false)
    })

    it("returns true when vibration exceeds max", () => {
        const machine = new Machine(
            new MachineId("M4"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.OVER),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            vibration: {
                max: MACHINE_LIMITS.VIBRATION.MAX
            }
        })
        expect(machine.isOvervibrating(config)).toBe(true)
    })

    it("returns false when vibration is below max", () => {
        const machine = new Machine(
            new MachineId("M4"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            vibration: {
                max: MACHINE_LIMITS.VIBRATION.MAX
            }
        })
        expect(machine.isOvervibrating(config)).toBe(false)
    })

    it("returns true when pressure exceeds max", () => {
        const machine = new Machine(
            new MachineId("M5"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.OVER)
        )
        const config: MachineConfig = fakeConfig({
            pressure: {
                max: MACHINE_LIMITS.PRESSURE.MAX
            }
        })
        expect(machine.isOverpressurized(config)).toBe(true)
    })

    it("returns false when pressure is below max", () => {
        const machine = new Machine(
            new MachineId("M5"),
            new Temperature(MACHINE_VALUES.TEMPERATURE.SAFE),
            new PowerConsumption(MACHINE_VALUES.POWER_CONSUMPTION.SAFE),
            new Emission(MACHINE_VALUES.EMISSION.SAFE),
            new Vibration(MACHINE_VALUES.VIBRATION.SAFE),
            new Pressure(MACHINE_VALUES.PRESSURE.SAFE)
        )
        const config: MachineConfig = fakeConfig({
            pressure: {
                max: MACHINE_LIMITS.PRESSURE.MAX
            }
        })
        expect(machine.isOverpressurized(config)).toBe(false)
    })
})
