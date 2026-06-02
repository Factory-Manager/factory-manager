import { describe, expect, it } from "vitest"
import { Range } from "../../../../../src/domain/shared/value-objects/range/range"
import { Temperature } from "../../../../../src/domain/machine/value-objects/temperature"

describe("Range", () => {

    const range = new Range(
        new Temperature(10),
        new Temperature(100)
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

})