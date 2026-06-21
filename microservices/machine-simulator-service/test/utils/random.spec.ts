import { describe, it, expect } from 'vitest'
import { random } from '../../src/utils/random'

const min = 10
const max = 20

describe('random', () => {
  it('returns a number between min and max', () => {
    const result = random(min, max)
    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThanOrEqual(max)
  })
})
