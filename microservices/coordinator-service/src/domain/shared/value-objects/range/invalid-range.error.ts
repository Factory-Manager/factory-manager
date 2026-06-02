export class InvalidRangeError extends Error {
  constructor(min: number, max: number) {
    super(`Invalid range: min (${min}) cannot be greater than max (${max})`)
    this.name = 'InvalidRangeError'
  }
}
