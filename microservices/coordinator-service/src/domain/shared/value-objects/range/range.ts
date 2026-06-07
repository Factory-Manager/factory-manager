import { ComparableValueObject } from '../comparable-value-object'
import { InvalidRangeError } from './invalid-range.error'

export class Range<T extends ComparableValueObject<number>> {
  constructor(
    public readonly min: T,
    public readonly max: T
  ) {
    if (min.isGreaterThan(max)) {
      throw new InvalidRangeError(min.value, max.value)
    }
  }

  contains(value: T): boolean {
    return (
      value.isGreaterThanOrEqual(this.min) && value.isLessThanOrEqual(this.max)
    )
  }

  isAboveMax(value: T): boolean {
    return value.isGreaterThan(this.max)
  }

  isBelowMin(value: T): boolean {
    return value.isLessThan(this.min)
  }
}
