import { PinoLogger } from './infrastructure/logger/pino-logger'
import { ProcessTelemetry } from './application/telemetry/process-telemetry'
import { AnomalyDetector } from './domain/anomaly/services/anomaly-detector'
import { TemperaturePolicy } from './domain/anomaly/services/policies/temperature-policy'
import { SystemClock } from './infrastructure/time/system-clock'
import { Temperature } from './domain/machine/value-objects/temperature'
import { Emission } from './domain/machine/value-objects/emission'
import { PowerConsumption } from './domain/machine/value-objects/power-consumption'
import { Pressure } from './domain/machine/value-objects/pressure'
import { Vibration } from './domain/machine/value-objects/vibration'
import { MachineConfig } from './domain/machine/machine-config'
import { Range } from './domain/shared/value-objects/range/range'
import { createMqttConsumer } from './infrastructure/mqtt/consumer'
import { getConfig } from './config/env'
import { ProcessHeartbeat } from './application/heartbeat/process-heartbeat'
import { TelemetryProcessor } from './application/messaging/processor/telemetry-processor'
import { CoordinatorMessageConsumer } from './application/messaging/coordinator-message-consumer'
import { HeartbeatProcessor } from './application/messaging/processor/heartbeat-processor'
import { TelemetryMessageMapper } from './application/telemetry/mapper/map-telemetry-message'
import { HeartbeatMessageMapper } from './application/heartbeat/mapper/map-heartbeat-message'

function buildMachineConfig(): MachineConfig {
  return new MachineConfig(
    new Range<Temperature>(new Temperature(0), new Temperature(100)),
    new Range<PowerConsumption>(
      new PowerConsumption(0),
      new PowerConsumption(200)
    ),
    new Range<Emission>(new Emission(0), new Emission(50)),
    new Range<Vibration>(new Vibration(0), new Vibration(10)),
    new Range<Pressure>(new Pressure(0), new Pressure(5))
  )
}

function bootstrap() {
  const baseLogger = new PinoLogger()
  const logger = baseLogger.child({
    service: 'coordinator-service'
  })
  const mqttLogger = baseLogger.child({
    service: 'mqtt'
  })

  const config = getConfig()
  const mqtt = createMqttConsumer(config.mqtt.url, mqttLogger)

  const policies = [new TemperaturePolicy()]
  const anomalyDetector = new AnomalyDetector(policies)
  const processTelemetry = new ProcessTelemetry(
    anomalyDetector,
    new SystemClock(),
    logger
  )
  const processHeartbeat = new ProcessHeartbeat(new SystemClock(), logger)
  const machineConfig = buildMachineConfig()

  mqtt.subscribe(`${config.mqtt.topic}/+`)
  mqtt.subscribe(`${config.mqtt.heartbeatTopic}/+`)

  mqtt.onMessage((topic, message) => {
    new CoordinatorMessageConsumer(
      [
        new TelemetryProcessor(
          processTelemetry,
          machineConfig,
          new TelemetryMessageMapper(),
          config.mqtt.topic
        ),
        new HeartbeatProcessor(
          processHeartbeat,
          new HeartbeatMessageMapper(),
          config.mqtt.heartbeatTopic
        )
      ],
      logger
    ).handle(topic, message)
  })
}

bootstrap()
