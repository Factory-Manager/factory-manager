import { describe, it, expect } from "vitest"
import { Machine } from "../../src/domain/machine"
import { Temperature } from "../../src/domain/temperature"

describe("Machine", () => {
    it("returns true when temperature exceeds max", () => {
        const machine = new Machine(
            "M1",
            new Temperature(100)
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
            new Temperature(60)
        )
        const config = {
            temperature: {
                max: 80
            }
        } as any
        expect(machine.isOverheating(config)).toBe(false)
    })
})