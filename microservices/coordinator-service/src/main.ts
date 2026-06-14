import { PinoLogger } from './infrastructure/logger/pino-logger'
import { ProcessTelemetry } from './application/telemetry/process-telemetry'
import { AnomalyDetector } from './domain/anomaly/services/anomaly-detector'
import { TemperaturePolicy } from './domain/anomaly/services/policies/temperature-policy'
import { TelemetryInput } from './application/telemetry/dto/telemetry-input'
import { SystemClock } from './infrastructure/time/system-clock'
import { Temperature } from './domain/machine/value-objects/temperature'
import { Emission } from './domain/machine/value-objects/emission'
import { PowerConsumption } from './domain/machine/value-objects/power-consumption'
import { Pressure } from './domain/machine/value-objects/pressure'
import { Vibration } from './domain/machine/value-objects/vibration'
import { MachineConfig } from './domain/machine/machine-config'
import { Range } from './domain/shared/value-objects/range/range'

function bootstrap() {
  const baseLogger = new PinoLogger()

  const logger = baseLogger.child({
    service: 'coordinator-service'
  })

  const policies = [new TemperaturePolicy()]
  const anomalyDetector = new AnomalyDetector(policies)

  const processTelemetry = new ProcessTelemetry(
    anomalyDetector,
    new SystemClock(),
    logger
  )

  const sampleInput: TelemetryInput = {
    machineId: 'machine-123',
    occurredAt: new Date().toISOString(),
    operatingTemperature: '85',
    powerConsumption: '150',
    emissions: '20',
    vibration: '5',
    pressure: '1.2'
  }
  const machineConfig: MachineConfig = new MachineConfig(
    new Range<Temperature>(new Temperature(0), new Temperature(100)),
    new Range<PowerConsumption>(
      new PowerConsumption(0),
      new PowerConsumption(200)
    ),
    new Range<Emission>(new Emission(0), new Emission(50)),
    new Range<Vibration>(new Vibration(0), new Vibration(10)),
    new Range<Pressure>(new Pressure(0), new Pressure(5))
  )
  processTelemetry.execute(sampleInput, machineConfig)

  const sampleInput2: TelemetryInput = {
    machineId: 'machine-123',
    occurredAt: new Date().toISOString(),
    operatingTemperature: '180',
    powerConsumption: '150',
    emissions: '20',
    vibration: '5',
    pressure: '1.2'
  }

  processTelemetry.execute(sampleInput2, machineConfig)
}

bootstrap()
