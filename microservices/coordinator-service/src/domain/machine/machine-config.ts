import { Range } from '../shared/value-objects/range/range'
import { Pressure } from './value-objects/pressure'
import { Emission } from './value-objects/emission'
import { PowerConsumption } from './value-objects/power-consumption'
import { Temperature } from './value-objects/temperature'
import { Vibration } from './value-objects/vibration'
import { MachineId } from './value-objects/machine-id'
export class MachineConfig {
  constructor(
    public readonly machineId: MachineId,
    public readonly temperature: Range<Temperature>,
    public readonly powerConsumption: Range<PowerConsumption>,
    public readonly emissions: Range<Emission>,
    public readonly vibration: Range<Vibration>,
    public readonly pressure: Range<Pressure>
  ) {}
}
