import { describe, it, expect } from "vitest"
import { AnomalyEventIdInvalidError } from "../../../../src/domain/anomaly/errors/anomaly-event-id-invalid.error"
import { AnomalyEventId } from "../../../../src/domain/anomaly/value-objetcs/anomaly-event-id"


describe("AnomalyEventId", () => {
  it("throws error when id is empty", () => {
    expect(() => new AnomalyEventId("")).toThrow(
      AnomalyEventIdInvalidError
    )
  })

  it("equals method should return true for same value", () => {
    const id1 = new AnomalyEventId("A1")
    const id2 = new AnomalyEventId("A1")
    expect(id1.equals(id2)).toBe(true)
  })

  it("equals method should return false for different values", () => {
    const id1 = new AnomalyEventId("A1")
    const id2 = new AnomalyEventId("A2")
    expect(id1.equals(id2)).toBe(false)
  })
})