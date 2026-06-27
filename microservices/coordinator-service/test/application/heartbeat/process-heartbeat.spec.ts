import { HeartbeatInput } from '@/application/heartbeat/dto/heartbeat-input'
import { ProcessHeartbeat } from '@/application/heartbeat/process-heartbeat'
import { createLoggerMock } from '@test/mocks/logger.mock'
import { describe, expect, it } from 'vitest'

describe('ProcessHeartbeat', () => {
  const occurredAtDate: Date = new Date('2025-12-31T23:59:00.000Z')
  it('should process heartbeat correctly', () => {
    const logger = createLoggerMock()
    const fakeClock = { now: () => new Date('2026-01-01T00:00:00Z') }
    const useCase = new ProcessHeartbeat(fakeClock, logger)
    const input: HeartbeatInput = {
      machineId: 'machine-1',
      timestamp: occurredAtDate.toISOString()
    }
    const result = useCase.execute(input)
    expect(result.machineId).toBe('machine-1')
    expect(result.occurredAt.toISOString()).toBe(occurredAtDate.toISOString())
    expect(result.receivedAt.toISOString()).toBe(fakeClock.now().toISOString())
  })

  it('should throw error for invalid machineId', () => {
    const logger = createLoggerMock()
    const fakeClock = { now: () => new Date('2026-01-01T00:00:00Z') }
    const useCase = new ProcessHeartbeat(fakeClock, logger)
    const input: HeartbeatInput = {
      machineId: '   ',
      timestamp: occurredAtDate.toISOString()
    }
    expect(() => useCase.execute(input)).toThrow(Error)
  })

  it('should throw error for invalid timestamp', () => {
    const logger = createLoggerMock()
    const fakeClock = { now: () => new Date('2026-01-01T00:00:00Z') }
    const useCase = new ProcessHeartbeat(fakeClock, logger)
    const input: HeartbeatInput = {
      machineId: 'machine-1',
      timestamp: 'invalid-timestamp'
    }
    expect(() => useCase.execute(input)).toThrow(Error)
  })
})
