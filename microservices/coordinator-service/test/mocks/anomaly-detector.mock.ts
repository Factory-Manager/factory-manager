import { vi } from 'vitest'

export const createAnomalyDetectorMock = () => ({
  detect: vi.fn()
})