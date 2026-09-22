export const MACHINE_IDS = {
  DEFAULT: '6a8771c13ec0b58b0b1ac2af',
  SECOND: '7a8771a63ec0b58b0b1ac2ae'
} as const

export const MACHINE_VALUES = {
  ID: MACHINE_IDS.DEFAULT,

  SEQUENCE_NUMBER: 1,

  TEMPERATURE: {
    SAFE: 55,
    OVER: 90,
    UNDER: 10
  },

  POWER_CONSUMPTION: {
    SAFE: 850,
    OVER: 1350
  },

  EMISSION: {
    SAFE: 50,
    OVER: 95
  },

  VIBRATION: {
    SAFE: 2.1,
    OVER: 5.3
  },

  PRESSURE: {
    SAFE: 6,
    OVER: 12
  }
}
