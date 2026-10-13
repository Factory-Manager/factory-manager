import { IdGenerator } from '@/domain/ports/id-generator'
import { randomUUID } from 'crypto'

/**
 * Implementation of the IdGenerator interface that generates unique identifiers using UUIDs.
 */
export class UUIDGenerator implements IdGenerator {
  /**
   * This method generates a unique identifier using the randomUUID function from the crypto module.
   * @returns A unique identifier as a string.
   */
  generateId(): string {
    return randomUUID()
  }
}
