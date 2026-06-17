export const MACHINE_STATES = Object.freeze({
  OFF: 'off',
  OPERATIONAL: 'operational',
  ANOMALY: 'anomaly'
})

export const MACHINE_STATE_VALUES = Object.freeze(Object.values(MACHINE_STATES))

const VALID_TRANSITIONS = Object.freeze({
  [MACHINE_STATES.OFF]: new Set([MACHINE_STATES.OPERATIONAL]),
  [MACHINE_STATES.OPERATIONAL]: new Set([
    MACHINE_STATES.OFF,
    MACHINE_STATES.ANOMALY
  ]),
  [MACHINE_STATES.ANOMALY]: new Set([
    MACHINE_STATES.OPERATIONAL,
    MACHINE_STATES.OFF
  ])
})

export function isValidStateTransition(from, to) {
  return VALID_TRANSITIONS[from]?.has(to) ?? false
}
