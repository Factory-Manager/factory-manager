import { describe, expect, it } from "vitest";
import { Anomaly } from "../../../src/domain/anomaly/anomaly";
import { AnomalyEventId } from "../../../src/domain/anomaly/value-objects/anomaly-event-id";
import { MachineId } from "../../../src/domain/machine/value-objects/machine-id";
import { SensorType } from "../../../src/domain/anomaly/value-objects/sensor-type";
import { MACHINE_VALUES } from "../../constants/machine-values";
import { MACHINE_LIMITS } from "../../constants/machine-limits";
import { AnomalyEventIdInvalidError } from "../../../src/domain/anomaly/errors/anomaly-event-id-invalid.error";

describe("Anomaly", () => {
    it("is created with the correct properties", () => {
        const anomaly = new Anomaly(
            new AnomalyEventId("A1"),
            new MachineId("M1"),
            SensorType.TEMPERATURE,
            MACHINE_VALUES.TEMPERATURE.OVER,
            new Date()
        );
        expect(anomaly.id).toEqual(new AnomalyEventId("A1"));
        expect(anomaly.machineId).toEqual(new MachineId("M1"));
        expect(anomaly.sensorType).toEqual(SensorType.TEMPERATURE);
        expect(anomaly.value).toEqual(MACHINE_VALUES.TEMPERATURE.OVER);
        expect(anomaly.occurredAt).toBeInstanceOf(Date);})

    it("should throw an error if AnomalyEventId is empty", () => {
        expect(() => new Anomaly(
            new AnomalyEventId(""),
            new MachineId("M1"),
            SensorType.TEMPERATURE,
            MACHINE_VALUES.TEMPERATURE.OVER,
            new Date()
        )).toThrow(AnomalyEventIdInvalidError);
    })
})