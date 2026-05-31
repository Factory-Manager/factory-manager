export class MachineConfig {
  constructor(
    public readonly temperature: {
      min: number
      max: number
    },
    public readonly powerConsumption: {
      min: number
      max: number
    }
  ) {}
}
