export abstract class ComparableValueObject<T> {
  protected constructor(readonly value: T) {}

  protected abstract compare(other: this): number

  isGreaterThanOrEqual(other: this): boolean {
    return this.compare(other) >= 0
  }

  isLessThanOrEqual(other: this): boolean {
    return this.compare(other) <= 0
  }
}
