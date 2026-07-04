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
import { MqttMessageDispatcher } from './application/messaging/mqtt-message-dispatcher'
import { HeartbeatProcessor } from './application/messaging/processor/heartbeat-processor'
import { TelemetryMessageMapper } from './application/telemetry/mapper/map-telemetry-message'
import { HeartbeatMessageMapper } from './application/heartbeat/mapper/map-heartbeat-message'
import { SqliteInboxRepository } from './infrastructure/persistence/sqlite/sqlite-inbox.repository'
import { createSqliteDatabase } from './infrastructure/persistence/sqlite/create-sqlite-database'

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
  const config = getConfig()
  const clock = new SystemClock()
  const baseLogger = new PinoLogger(config.nodeEnv)
  const logger = baseLogger.child({
    service: 'coordinator-service'
  })

  const mqtt = createMqttConsumer(
    config.mqtt.url,
    baseLogger.child({ service: 'mqtt' })
  )
  const db = createSqliteDatabase(config.inboxDbPath)
  const inboxRepository = new SqliteInboxRepository(db)

  const policies = [new TemperaturePolicy()]
  const anomalyDetector = new AnomalyDetector(policies)
  const processTelemetry = new ProcessTelemetry(anomalyDetector, clock, logger)
  const processHeartbeat = new ProcessHeartbeat(clock, logger)
  const machineConfig = buildMachineConfig()

  const dispatcher = new MqttMessageDispatcher(
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
    inboxRepository,
    clock,
    logger
  )

  mqtt.subscribe(`${config.mqtt.topic}/+`, { qos: 1 })
  mqtt.subscribe(`${config.mqtt.heartbeatTopic}/+`, { qos: 0 })

  mqtt.onMessage((topic, message) => {
    dispatcher.handle(topic, message)
  })
}

bootstrap()
