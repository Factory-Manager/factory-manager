import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  MACHINE_STATES,
  isValidStateTransition
} from '#src/domain/machines/machine.states.js'

describe('machine state transitions', () => {
  it('allows all documented valid transitions', () => {
    const validTransitions = [
      [MACHINE_STATES.OFF, MACHINE_STATES.OPERATIONAL],
      [MACHINE_STATES.OPERATIONAL, MACHINE_STATES.OFF],
      [MACHINE_STATES.OPERATIONAL, MACHINE_STATES.ANOMALY],
      [MACHINE_STATES.ANOMALY, MACHINE_STATES.OPERATIONAL],
      [MACHINE_STATES.ANOMALY, MACHINE_STATES.OFF]
    ]

    for (const [from, to] of validTransitions) {
      assert.equal(
        isValidStateTransition(from, to),
        true,
        `expected ${from} → ${to} to be valid`
      )
    }
  })

  it('rejects invalid transitions', () => {
    const invalidTransitions = [
      [MACHINE_STATES.OFF, MACHINE_STATES.ANOMALY],
      [MACHINE_STATES.OFF, MACHINE_STATES.OFF],
      [MACHINE_STATES.OPERATIONAL, MACHINE_STATES.OPERATIONAL],
      [MACHINE_STATES.ANOMALY, MACHINE_STATES.ANOMALY]
    ]

    for (const [from, to] of invalidTransitions) {
      assert.equal(
        isValidStateTransition(from, to),
        false,
        `expected ${from} → ${to} to be invalid`
      )
    }
  })

  it('returns false for unknown states', () => {
    assert.equal(isValidStateTransition('unknown', MACHINE_STATES.OFF), false)
    assert.equal(isValidStateTransition(MACHINE_STATES.OFF, 'unknown'), false)
  })
})
