import { MachineConfig } from "../../src/domain/machine-config";
import { MACHINE_LIMITS } from "../constants/machine-limits"

export function fakeConfig(overrides?: any): MachineConfig {
  return {
    temperature: {
      min: MACHINE_LIMITS.TEMPERATURE.MIN,
      max: MACHINE_LIMITS.TEMPERATURE.MAX,
      ...(overrides?.temperature ?? {})
    },
    powerConsumption: {
      min: MACHINE_LIMITS.POWER_CONSUMPTION.MIN,
      max: MACHINE_LIMITS.POWER_CONSUMPTION.MAX,
      ...(overrides?.powerConsumption ?? {})
    },
    emissions: {
      min: MACHINE_LIMITS.EMISSION.MIN,
      max: MACHINE_LIMITS.EMISSION.MAX,
      ...(overrides?.emissions ?? {})
    }
  };
}