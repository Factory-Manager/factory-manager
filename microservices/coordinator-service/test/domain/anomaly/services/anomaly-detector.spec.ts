import { describe, expect, it } from "vitest"
import { AnomalyDetector } from "../../../../src/domain/anomaly/services/anomaly-detector"
import { TemperaturePolicy } from "../../../../src/domain/anomaly/services/policies/temperature-policy"
import { TelemetryEvent } from "../../../../src/application/telemetry/dto/telemetry-event"
import { MachineConfig } from "../../../../src/domain/machine/machine-config"
import { MACHINE_LIMITS } from "../../../constants/machine-limits"
import { MACHINE_VALUES } from "../../../constants/machine-values"
import { fakeConfig } from "../../../utils/fake-config"


describe('AnomalyDetector', () => {
    it('should aggregate anomalies from policies', () => {
        const detector = new AnomalyDetector([
            new TemperaturePolicy()
        ])

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
        const anomalies = detector.detect(event, config);
        expect(anomalies).toHaveLength(1);
        expect(anomalies[0].sensorType).toBe("TEMPERATURE");
        expect(anomalies[0].value).toBe(event.operatingTemperature);
    })

    it('should return an empty array when no policies detect anomalies', () => {
        const detector = new AnomalyDetector([
            new TemperaturePolicy()
        ])
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
        const anomalies = detector.detect(event, config);
        expect(anomalies).toHaveLength(0);
    })
})