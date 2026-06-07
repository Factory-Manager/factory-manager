import { describe, expect, it } from "vitest"
import { MACHINE_VALUES } from "../../../../constants/machine-values";
import { fakeConfig } from "../../../../utils/fake-config";
import { MachineConfig } from "../../../../../src/domain/machine/machine-config";
import { MACHINE_LIMITS } from "../../../../constants/machine-limits";
import { TelemetryEvent } from "../../../../../src/application/telemetry/dto/telemetry-event";
import { TemperaturePolicy } from "../../../../../src/domain/anomaly/services/policies/temperature-policy";
import { SensorType } from "../../../../../src/domain/anomaly/value-objects/sensor-type";

it("should return an anomaly with correct details when temperature is over the maximum limit", () => {
    const policy = new TemperaturePolicy();
    const event: TelemetryEvent = {
        machineId: MACHINE_VALUES.ID,
        occurredAt: new Date(),
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
    const anomalies = policy.evaluate(event, config, new Date());
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0].sensorType).toBe(SensorType.TEMPERATURE);
    expect(anomalies[0].value).toBe(event.operatingTemperature);
})

it("should detect temperature anomalies under the minimum limit", () => {
    const policy = new TemperaturePolicy();
    const event: TelemetryEvent = {
        machineId: MACHINE_VALUES.ID,
        occurredAt: new Date(),
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
    const anomalies = policy.evaluate(event, config, new Date());
    expect(anomalies).toHaveLength(1);
})

it("should not detect any anomaly when temperature is within limits", () => {
    const policy = new TemperaturePolicy();
    const event: TelemetryEvent = {
        machineId: MACHINE_VALUES.ID,
        occurredAt: new Date(),
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
    const anomalies = policy.evaluate(event, config, new Date());
    expect(anomalies).toHaveLength(0);
})
