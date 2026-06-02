import { describe, expect, it } from "vitest"
import { Range } from "../../../../../src/domain/shared/value-objects/range/range"
import { Temperature } from "../../../../../src/domain/machine/value-objects/temperature"
import { InvalidRangeError } from "../../../../../src/domain/shared/value-objects/range/invalid-range.error"

describe("Range", () => {

    const MIN = 10
    const MAX = 100
    const range = new Range(
        new Temperature(MIN),
        new Temperature(MAX)
    )

    it("returns true when value is inside range", () => {
        expect(
            range.contains(new Temperature(50))
        ).toBe(true)
    })

    it("returns false when value is outside range", () => {
        expect(
            range.contains(new Temperature(5))
        ).toBe(false)
    })

    it("returns true when value is above or equal to max", () => {
        expect(
            range.isAboveOrEqualMax(new Temperature(MAX))
        ).toBe(true)
    })

    it("returns true when value is below or equal to min", () => {
        expect(
            range.isBelowOrEqualMin(new Temperature(MIN))
        ).toBe(true)
    })

    it("throws error when min is greater than max", () => {
        expect(() => {
            new Range(
                new Temperature(MAX),
                new Temperature(MIN)
            )
        }).toThrow(InvalidRangeError)
    })
})
