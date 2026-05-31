import { describe, it, expect } from "vitest"
import { Machine } from "../../src/domain/machine"
import { Temperature } from "../../src/domain/temperature"
import { PowerConsumption } from "../../src/domain/power-consuption"
import { Emission } from "../../src/domain/emission"

describe("Machine", () => {
    it("returns true when temperature exceeds max", () => {
        const machine = new Machine(
            "M1",
            new Temperature(100),
            new PowerConsumption(50),
            new Emission(30)
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
            new PowerConsumption(50),
            new Emission(30)
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
            new PowerConsumption(100),
            new Emission(30)
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
            new PowerConsumption(50),
            new Emission(30)
        )
        const config = {
            powerConsumption: {
                max: 80
            }
        } as any
        expect(machine.isOverconsuming(config)).toBe(false)
    })

    it("returns true when emissions exceed max", () => {
        const machine = new Machine(
            "M5",
            new Temperature(60),
            new PowerConsumption(50),
            new Emission(100)
        )
        const config = {
            emissions: {
                max: 80
            }
        } as any
        expect(machine.isOveremitting(config)).toBe(true)
    })

    it("returns false when emissions are below max", () => {
        const machine = new Machine(
            "M6",
            new Temperature(60),
            new PowerConsumption(50),
            new Emission(30)
        )
        const config = {
            emissions: {
                max: 80
            }
        } as any
        expect(machine.isOveremitting(config)).toBe(false)
    })
})