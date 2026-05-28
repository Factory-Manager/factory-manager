export class MachineConfig {
  constructor(
    public readonly temperature: {
      min: number
      max: number
    }
  ) {}
}
