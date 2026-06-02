import { ComparableValueObject } from '../../shared/value-objects/comparable-value-object'

export class Temperature extends ComparableValueObject<number> {
  constructor(value: number) {
    super(value)
  }

  protected compare(other: this): number {
    return this.value - other.value
  }
}
