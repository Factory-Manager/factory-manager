import { describe, expect, it } from "vitest";
import { MachineFactory } from "../../../src/domain/machine/machine-factory"

describe("MachineFactory", () => {
    it("should create a machine from sensors data", () => {

        const inputSensors = {
            temperature: 50,
            power: 100,
            emission: 20,
            vibration: 1.2,
            pressure: 5
        }

        const machine = MachineFactory.createFromSensors("M1", inputSensors)

        expect(machine).toMatchObject({
            id: expect.objectContaining({ value: "M1" }),
            temperature: expect.objectContaining({ value: 50 }),
            powerConsumption: expect.objectContaining({ value: 100 }),
            emissions: expect.objectContaining({ value: 20 }),
            vibration: expect.objectContaining({ value: 1.2 }),
            pressure: expect.objectContaining({ value: 5 })
        })

    })
})