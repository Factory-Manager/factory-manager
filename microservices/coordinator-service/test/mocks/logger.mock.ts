import { vi } from 'vitest'
import { Logger } from '@/application/ports/logger'

export const createLoggerMock = (): Logger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
})
