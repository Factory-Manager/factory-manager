import { describe, it, expect } from "vitest"
import { Machine } from "../../src/domain/machine"
import { Temperature } from "../../src/domain/temperature"
import { PowerConsumption } from "../../src/domain/power-consuption"

describe("Machine", () => {
    it("returns true when temperature exceeds max", () => {
        const machine = new Machine(
            "M1",
            new Temperature(100),
            new PowerConsumption(50)
        )

        const config = {
            temperature: {
                max: 80
            }
        } as any

        expect(machine.isOverheating(config)).toBe(true)
    })

    it("returns false when temperature is below max", () => {
        const machine = new Machine(
            "M2",
            new Temperature(60),
            new PowerConsumption(50)
        )
        const config = {
            temperature: {
                max: 80
            }
        } as any
        expect(machine.isOverheating(config)).toBe(false)
    })

    it("returns true when power consumption exceeds max", () => {
        const machine = new Machine(
            "M3",
            new Temperature(60),
            new PowerConsumption(100)
        )
        const config = {
            powerConsumption: {
                max: 80
            }
        } as any
        expect(machine.isOverconsuming(config)).toBe(true)
    })

    it("returns false when power consumption is below max", () => {
        const machine = new Machine(
            "M4",
            new Temperature(60),
            new PowerConsumption(50)
        )
        const config = {
            powerConsumption: {
                max: 80
            }
        } as any
        expect(machine.isOverconsuming(config)).toBe(false)
    })
})