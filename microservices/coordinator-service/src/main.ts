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
import { InboxReceiver } from './application/messaging/inbox-receiver'
import { HeartbeatProcessor } from './application/messaging/processor/heartbeat-processor'
import { SqliteInboxRepository } from './infrastructure/persistence/sqlite/sqlite-inbox.repository'
import { createSqliteDatabase } from './infrastructure/persistence/sqlite/create-sqlite-database'
import { randomUUID } from 'crypto'
import { IncomingMessage } from './application/messaging/incoming-message'
import { InboxWorker } from './application/workers/inbox-worker'
import { SqliteHeartbeatRepository } from './infrastructure/persistence/sqlite/sqlite-heartbeat.repository'
import { HeartbeatTimeoutPolicy } from './domain/machine/policies/heatbeat-timeout-policy'
import { HeartbeatMonitor } from './application/workers/heartbeat-monitor'
import { MachineId } from './domain/machine/value-objects/machine-id'

function buildMachineConfig(): MachineConfig {
  return new MachineConfig(
    new MachineId('6a8771c13ec0b58b0b1ac2af'),
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
  const heartbeatRepository = new SqliteHeartbeatRepository(db)

  const policies = [new TemperaturePolicy()]
  const anomalyDetector = new AnomalyDetector(policies)
  const processTelemetry = new ProcessTelemetry(anomalyDetector, clock, logger)
  const processHeartbeat = new ProcessHeartbeat(clock, logger)
  const machineConfig = buildMachineConfig()

  const inboxReceiver = new InboxReceiver(inboxRepository, logger)

  const inboxWorker = new InboxWorker(
    [
      new TelemetryProcessor(
        processTelemetry,
        machineConfig,
        config.mqtt.topic
      ),
      new HeartbeatProcessor(processHeartbeat, config.mqtt.heartbeatTopic)
    ],
    inboxRepository,
    clock,
    baseLogger.child({ service: 'inbox-worker' })
  )
  const heartbeatMonitor = new HeartbeatMonitor(
    heartbeatRepository,
    new HeartbeatTimeoutPolicy(config.heartbeatTimeoutMs),
    config.mqtt.heartbeatTopic,
    clock,
    baseLogger.child({ service: 'heartbeat-monitor' })
  )

  mqtt.subscribe(`${config.mqtt.topic}/+`, { qos: 1 })
  mqtt.subscribe(`${config.mqtt.heartbeatTopic}/+`, { qos: 0 })

  mqtt.onMessage((topic, message) => {
    const incomingMessage: IncomingMessage = {
      id: randomUUID(),
      topic,
      payload: message,
      receivedAt: clock.now()
    }
    inboxReceiver.receive(incomingMessage)
  })

  setInterval(() => {
    inboxWorker.run()
  }, 1000)

  setInterval(() => {
    heartbeatMonitor.run()
  }, 3000)
}

bootstrap()
