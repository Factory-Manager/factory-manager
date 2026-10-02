/**
 * Interface for generating unique identifiers.
 */
export interface IdGenerator {
  /**
   * Generates a unique identifier.
   * @returns A unique identifier as a string.
   */
  generateId(): string
}
