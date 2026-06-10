export const AREA_TEST_VALUES = Object.freeze({
  name: 'Workshop A',
  size: 200,
  invalidSize: 0
})

export function createValidAreaData(overrides = {}) {
  return {
    name: AREA_TEST_VALUES.name,
    size: AREA_TEST_VALUES.size,
    ...overrides
  }
}

export function createValidCreateAreaInput(overrides = {}) {
  return {
    name: AREA_TEST_VALUES.name,
    size: AREA_TEST_VALUES.size,
    ...overrides
  }
}
