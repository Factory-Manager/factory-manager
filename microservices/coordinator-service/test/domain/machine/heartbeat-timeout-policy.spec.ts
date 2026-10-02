import { describe, expect, it } from 'vitest'
import { HeartbeatTimeoutPolicy } from '@/domain/machine/policies/heatbeat-timeout-policy'

describe('HeartbeatTimeoutPolicy', () => {
  const policy = new HeartbeatTimeoutPolicy(10_000)

  it('should return operational when heartbeat is within timeout', () => {
    const lastHeartbeatAt = new Date('2026-08-18T12:00:00.000Z')
    const now = new Date('2026-08-18T12:00:05.000Z')

    const result = policy.evaluate(lastHeartbeatAt, now)

    expect(result).toBe('operational')
  })

  it('should return off when heartbeat reaches timeout', () => {
    const lastHeartbeatAt = new Date('2026-08-18T12:00:00.000Z')
    const now = new Date('2026-08-18T12:00:10.000Z')

    const result = policy.evaluate(lastHeartbeatAt, now)

    expect(result).toBe('off')
  })

  it('should return off when heartbeat exceeds timeout', () => {
    const lastHeartbeatAt = new Date('2026-08-18T12:00:00.000Z')
    const now = new Date('2026-08-18T12:00:15.000Z')

    const result = policy.evaluate(lastHeartbeatAt, now)

    expect(result).toBe('off')
  })
})
