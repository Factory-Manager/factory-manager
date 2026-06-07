import { describe, expect, it } from "vitest"
import { MACHINE_VALUES } from "@test/constants/machine-values";
import { fakeConfig } from "@test/utils/fake-config";
import { MachineConfig } from "@/domain/machine/machine-config";
import { MACHINE_LIMITS } from "@test/constants/machine-limits";
import { TelemetryEvent } from "@/application/telemetry/dto/telemetry-event";
import { TemperaturePolicy } from "@/domain/anomaly/services/policies/temperature-policy";
import { SensorType } from "@/domain/anomaly/value-objects/sensor-type";

describe("TemperaturePolicy", () => {

    it("should return an anomaly with correct details when temperature is over the maximum limit", () => {
        const policy = new TemperaturePolicy();
        const event: TelemetryEvent = {
            machineId: MACHINE_VALUES.ID,
            occurredAt: new Date('2025-12-31T23:59:00.000Z'),
            processedAt: new Date('2026-01-01T00:00:00.000Z'),
            operatingTemperature: MACHINE_VALUES.TEMPERATURE.OVER,
            powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
            emissions: MACHINE_VALUES.EMISSION.SAFE,
            vibration: MACHINE_VALUES.VIBRATION.SAFE,
            pressure: MACHINE_VALUES.PRESSURE.SAFE
        };
        const config: MachineConfig = fakeConfig({
            temperature: {
                min: MACHINE_LIMITS.TEMPERATURE.MIN,
                max: MACHINE_LIMITS.TEMPERATURE.MAX,
            }
        });
        const anomalies = policy.evaluate(event, config);
        expect(anomalies).toHaveLength(1);
        expect(anomalies[0].sensorType).toBe(SensorType.TEMPERATURE);
        expect(anomalies[0].value).toBe(event.operatingTemperature);
    })

    it("should detect temperature anomalies under the minimum limit", () => {
        const policy = new TemperaturePolicy();
        const event: TelemetryEvent = {
            machineId: MACHINE_VALUES.ID,
            occurredAt: new Date('2025-12-31T23:59:00.000Z'),
            processedAt: new Date('2026-01-01T00:00:00.000Z'),
            operatingTemperature: MACHINE_VALUES.TEMPERATURE.UNDER,
            powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
            emissions: MACHINE_VALUES.EMISSION.SAFE,
            vibration: MACHINE_VALUES.VIBRATION.SAFE,
            pressure: MACHINE_VALUES.PRESSURE.SAFE
        };
        const config: MachineConfig = fakeConfig({
            temperature: {
                min: MACHINE_LIMITS.TEMPERATURE.MIN,
                max: MACHINE_LIMITS.TEMPERATURE.MAX,
            }
        });
        const anomalies = policy.evaluate(event, config);
        expect(anomalies).toHaveLength(1);
        expect(anomalies[0].sensorType).toBe(SensorType.TEMPERATURE);
        expect(anomalies[0].value).toBe(event.operatingTemperature);
    })

    it("should not detect any anomaly when temperature is within limits", () => {
        const policy = new TemperaturePolicy();
        const event: TelemetryEvent = {
            machineId: MACHINE_VALUES.ID,
            occurredAt: new Date('2025-12-31T23:59:00.000Z'),
            processedAt: new Date('2026-01-01T00:00:00.000Z'),
            operatingTemperature: MACHINE_VALUES.TEMPERATURE.SAFE,
            powerConsumption: MACHINE_VALUES.POWER_CONSUMPTION.SAFE,
            emissions: MACHINE_VALUES.EMISSION.SAFE,
            vibration: MACHINE_VALUES.VIBRATION.SAFE,
            pressure: MACHINE_VALUES.PRESSURE.SAFE
        };
        const config: MachineConfig = fakeConfig({
            temperature: {
                min: MACHINE_LIMITS.TEMPERATURE.MIN,
                max: MACHINE_LIMITS.TEMPERATURE.MAX,
            }
        });
        const anomalies = policy.evaluate(event, config);
        expect(anomalies).toHaveLength(0);
    })
})