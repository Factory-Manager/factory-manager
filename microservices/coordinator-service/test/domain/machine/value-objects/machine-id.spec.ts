import { describe, it, expect } from "vitest"
import { MachineId } from "../../../../src/domain/machine/value-objects/machine-id"
import { InvalidMachineIdError } from "../../../../src/domain/machine/errors/invalid-machine-id.error"


describe("MachineId", () => {
  it("throws error when id is empty", () => {
    expect(() => new MachineId("")).toThrow(
      InvalidMachineIdError
    )
  })
})