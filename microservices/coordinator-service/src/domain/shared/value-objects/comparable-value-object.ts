export abstract class ComparableValueObject<T> {
  protected constructor(readonly value: T) {}

  protected abstract compare(other: this): number

  isGreaterThan(other: this): boolean {
    return this.compare(other) > 0
  }

  isGreaterThanOrEqual(other: this): boolean {
    return this.compare(other) >= 0
  }

  isLessThan(other: this): boolean {
    return this.compare(other) < 0
  }

  isLessThanOrEqual(other: this): boolean {
    return this.compare(other) <= 0
  }
}
