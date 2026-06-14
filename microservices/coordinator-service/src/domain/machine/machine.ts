import type { Emission } from './value-objects/emission'
import type { MachineConfig } from './machine-config'
import type { PowerConsumption } from './value-objects/power-consumption'
import type { Pressure } from './value-objects/pressure'
import type { Temperature } from './value-objects/temperature'
import type { Vibration } from './value-objects/vibration'
import type { MachineId } from './value-objects/machine-id'

/**
 * Represents a machine in a factory, with its current state and behavior to check if it's operating within the specified configuration limits.
 */
export class Machine {
  /**
   * Creates a new {@link Machine} instance with the given parameters.
   * @param id the unique identifier of the machine
   * @param temperature the current temperature of the machine
   * @param powerConsumption the current power consumption of the machine
   * @param emissions the current emissions of the machine
   * @param vibration the current vibration level of the machine
   * @param pressure the current pressure of the machine
   */
  constructor(
    public readonly id: MachineId,
    public temperature: Temperature,
    public powerConsumption: PowerConsumption,
    public emissions: Emission,
    public vibration: Vibration,
    public pressure: Pressure
  ) {}

  /**
   * Checks if this machine is equal to another machine based on their unique identifiers.
   * @param other the other machine to compare with
   * @returns true if the machines are equal, false otherwise
   */
  isEqual(other: Machine): boolean {
    return this.id.equals(other.id)
  }

  /**
   * Checks if the machine is overheating based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is overheating, false otherwise
   */
  isOverheating(config: MachineConfig): boolean {
    return this.temperature.isGreaterThan(config.temperature.max)
  }

  /**
   * Checks if the machine is underheating based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is underheating, false otherwise
   */
  isUnderheating(config: MachineConfig): boolean {
    return this.temperature.isLessThan(config.temperature.min)
  }

  /**
   * Checks if the machine is overconsuming power based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is overconsuming power, false otherwise
   */
  isOverconsuming(config: MachineConfig): boolean {
    return this.powerConsumption.isGreaterThan(config.powerConsumption.max)
  }

  /**
   * Checks if the machine is overemitting emissions based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is overemitting emissions, false otherwise
   */
  isOveremitting(config: MachineConfig): boolean {
    return this.emissions.isGreaterThan(config.emissions.max)
  }

  /**
   * Checks if the machine is overvibrating based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is overvibrating, false otherwise
   */
  isOvervibrating(config: MachineConfig): boolean {
    return this.vibration.isGreaterThan(config.vibration.max)
  }

  /**
   * Checks if the machine is overpressurized based on the provided configuration limits.
   * @param config the machine configuration to compare against
   * @returns true if the machine is overpressurized, false otherwise
   */
  isOverpressurized(config: MachineConfig): boolean {
    return this.pressure.isGreaterThan(config.pressure.max)
  }
}
